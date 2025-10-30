const excludedInterfaceMembersMap = new Map<string, string[]>([
    [
        'Element',
        ['innerHTML', 'outerHTML', 'classList', 'className']
    ],
    [
        'HTMLElement',
        ['innerText', 'outerText']
    ],
    [
        'ElementCSSInlineStyle',
        ['style']
    ],
    [
        'Node',
        ['nodeValue', 'textContent']
    ],
    [
        'HTMLTableElement',
        ['caption', 'thead', 'tFoot']
    ],
]);

export function getExcludedInterfaceMembers(interfaceName: string): readonly string[] {
    return excludedInterfaceMembersMap.get(interfaceName) ?? []
}