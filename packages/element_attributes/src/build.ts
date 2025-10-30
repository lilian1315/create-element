import { InterfaceDeclaration, ModuleDeclarationKind, Project, SyntaxKind, VariableDeclarationKind } from "ts-morph"
import { getInterfaceReccursiveExtends } from "./utils/get_interface_recursive_extends.ts"
import { SingleBar } from 'cli-progress'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { getExcludedInterfaceMembers } from "./utils/get_excluded_interface_members.ts"
import { isEventHandler } from "./utils/is_event_handler.ts"
import { getCamelcaseEventHandlerName } from "./utils/get_camelcase_event_handler_name.ts"

const progressBar = new SingleBar({
    format: '[{bar}] {percentage}% | {value}/{total}{info}',
})
const tempProject = new Project({
    useInMemoryFileSystem: true
})

const webTypesFile = tempProject.createSourceFile('index.d.ts', readFileSync('./node_modules/@types/web/index.d.ts').toString())

const primaryInterfacesNamesSet = new Set<string>()
const selectedInterfaces = new Set<InterfaceDeclaration>()
const interfaceEventHandlersNames = new Map<string, Set<string>>()
const interfaces = webTypesFile.getInterfaces()

console.log('Filtering interfaces...')
progressBar.start(interfaces.length, 0, { info: '' })

for (const iface of interfaces) {
    progressBar.increment(1, { info: ' | Checking ' + iface.getName() })
    const ifaceExtends = getInterfaceReccursiveExtends(iface)
    
    if (
        [
            'HTMLElement',
            'SVGElement',
            'MathMLElement',
            'HTMLElementTagNameMap',
            'HTMLElementDeprecatedTagNameMap',
            'SVGElementTagNameMap',
            'MathMLElementTagNameMap',
        ].includes(iface.getName()) === false
        && ['HTMLElement', 'SVGElement'].some(
            (name) => Array.from(ifaceExtends).map((i) => i.getName()).includes(name)
        ) === false
    ) {
        continue
    }

    primaryInterfacesNamesSet.add(iface.getName())
    selectedInterfaces.add(iface)
    ifaceExtends.forEach(i => selectedInterfaces.add(i))
}
progressBar.stop()

console.log('Finding event handlers names...')
progressBar.start(selectedInterfaces.size, 0, { info: '' })

selectedInterfaces.forEach((i) => {
    progressBar.increment(1, { info: ' | Checking ' + i.getName() })
    i.getMembers().forEach((m) => {
        if (!isEventHandler(m, webTypesFile)) return
        const eventHandlerNames = interfaceEventHandlersNames.get(i.getName()) ?? new Set<string>()
        eventHandlerNames.add(m.getName())
        interfaceEventHandlersNames.set(i.getName(), eventHandlerNames)
    });
})

progressBar.stop()

const tempFile = tempProject.createSourceFile('temp.ts')
tempFile.addInterfaces(Array.from(selectedInterfaces).map((i) => i.getStructure()))

const tempFileInterfaces = tempFile.getInterfaces()
const gereratedTypesFile = tempProject.createSourceFile('generated_types.ts')

console.log('Removing unwanted interface members, transforming getters/setters to properties and adding camelcase version for event handlers...')
progressBar.start(tempFileInterfaces.map((i) => i.getMembers().length).reduce((a, b) => a + b, 0), 0, { info: '' })

await Promise.all(tempFileInterfaces.map(async (i) => {
    if(primaryInterfacesNamesSet.has(i.getName())) i.setIsExported(true)

    const excludedMembers = getExcludedInterfaceMembers(i.getName())
    const eventHandlerNames = interfaceEventHandlersNames.get(i.getName())

    i.getMembers().forEach(m => {
        const name =
            m.isKind(SyntaxKind.PropertySignature)
            || m.isKind(SyntaxKind.MethodSignature)
            || m.isKind(SyntaxKind.GetAccessor)
            || m.isKind(SyntaxKind.SetAccessor)
            ? m.getName() : null

        progressBar.increment(1, { info: ' | Processing ' + i.getName() + (name ? '.' + name : '') })

        if(m.isKind(SyntaxKind.PropertySignature) && name && eventHandlerNames?.has(name)) {
            const camelCaseName = getCamelcaseEventHandlerName(i.getName(), name)

            if(!camelCaseName) throw new Error(`Could not find camelCase name for event handler ${i.getName()}.${name}. Please add it to the map in src/generate/utils/get-camelcase-event-handler-name.ts`)
            const listenerStructure = m.getStructure()

            listenerStructure.name = camelCaseName
            i.addProperty(listenerStructure)
        }

        if (
            (name && excludedMembers.includes(name))
            || m.isKind(SyntaxKind.MethodSignature)
            || m.isKind(SyntaxKind.GetAccessor)
            || m.isKind(SyntaxKind.PropertySignature) && m.isReadonly()
        ) {
            m.remove()
        } else if (m.isKind(SyntaxKind.SetAccessor)) {
            const tempProperty = i.addProperty({
                name: m.getName(),
                docs: m.getJsDocs().map(d => d.getInnerText()),
                type: m.getParameters()[0].getType().getText(),
                
            })

            const propertyText = tempProperty.getText()
            tempProperty.remove()

            m.replaceWithText(propertyText)
        }
        
    })
}))
progressBar.stop()

const namespace = gereratedTypesFile.addModule({
    name: "ElementAttributes",
    isExported: true,
    declarationKind: ModuleDeclarationKind.Namespace,
})

namespace.addInterfaces(Array.from(tempFileInterfaces).map(i => i.getStructure()))

console.log('Saving types...')
gereratedTypesFile.formatText()
if(!existsSync('./dist')) mkdirSync('./dist')
writeFileSync('./dist/index.ts', gereratedTypesFile.getFullText())

namespace.setHasDeclareKeyword(true)

writeFileSync('./dist/index.d.ts', gereratedTypesFile.getFullText())
console.log('Done!')