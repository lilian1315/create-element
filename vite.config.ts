import { defineConfig } from 'vite-plus'

const ignorePatterns = ['**/generated/**']
const corePkg = '@lilian1315/create-element'
const pluginPkg = '@lilian1315/oxlint-plugin-create-element'
const typesPkg = '@lilian1315/elements-writable-properties-types'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    ignorePatterns,
    jsPlugins: ['@lilian1315/oxlint-plugin-create-element'],
    rules: {
      'create-element/valid-jsx-type-assertion': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns,
    semi: false,
    singleQuote: true,
    sortImports: true,
  },
  run: {
    cache: true,
    tasks: {
      check: 'vp check',
      fix: 'vp check --fix',
      build: "vpr -F './packages/*' build",
      test: "vpr -F './packages/*' test",
      'release:core': {
        command: `vp exec -F ${corePkg} bumpp --all -c "release ${corePkg}@" -t ${corePkg}@`,
        dependsOn: ['check', `${corePkg}#build`, `${corePkg}#test`],
      },
      'release:plugin': {
        command: `vp exec -F ${pluginPkg} bumpp --all -c "release ${pluginPkg}@" -t ${pluginPkg}@`,
        dependsOn: ['check', `${pluginPkg}#build`, `${pluginPkg}#test`],
      },
      'release:types': {
        command: `vp exec -F ${typesPkg} bumpp --all -c "release ${typesPkg}@" -t ${typesPkg}@`,
        dependsOn: ['check'],
      },
    },
  },
})
