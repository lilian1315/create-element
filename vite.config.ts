import { defineConfig } from 'vite-plus'

const ignorePatterns = ['**/generated/**']
const corePkg = '@lilian1315/create-element'
const pluginPkg = '@lilian1315/oxlint-plugin-create-element'
const typesPkg = '@lilian1315/elements-writable-properties-types'
const generateDenoConfig = 'node ../../scripts/generate-deno-config.ts'

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
      '_release:core': {
        command: [
          'vp check',
          `vpr -t ${corePkg}#build`,
          `vpr -t ${corePkg}#test`,
          `vpr -F ${corePkg} test:exports`,
          `vp exec -F ${corePkg} bumpp -x "${generateDenoConfig}" -c "release ${corePkg}@" -t ${corePkg}@`,
        ],
      },
      '_release:plugin': {
        command: [
          'vp check',
          `vpr -t ${pluginPkg}#build`,
          `vpr -t ${pluginPkg}#test`,
          `vp exec -F ${pluginPkg} bumpp -x "${generateDenoConfig}" -c "release ${pluginPkg}@" -t ${pluginPkg}@`,
        ],
      },
      '_release:types': {
        command: [
          'vp check',
          `vp exec -F ${typesPkg} bumpp -x "${generateDenoConfig}" -c "release ${typesPkg}@" -t ${typesPkg}@`,
        ],
      },
    },
  },
})
