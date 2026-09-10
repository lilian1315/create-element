import { defineConfig } from 'vite-plus'

const ignorePatterns = ['**/generated/**']
const corePkg = '@lilian1315/create-element'
const pluginPkg = '@lilian1315/oxlint-plugin-create-element'
const typesPkg = '@lilian1315/elements-writable-properties-types'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
    'pnpm-workspace.yaml': 'vpr generate-deno-config',
  },
  lint: {
    ignorePatterns,
    jsPlugins: ['@lilian1315/oxlint-plugin-create-element'],
    rules: {
      'create-element/valid-jsx-element-type-assertion': 'error',
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
      'generate-deno-config': 'node scripts/generate-deno-config.ts',
      '_release:core': {
        command: [
          'vp check',
          `vpr -t ${corePkg}#build`,
          `vpr -t ${corePkg}#test`,
          `vpr -F ${corePkg} test:exports`,
          `vp exec -F ${corePkg} bumpp -c "release ${corePkg}@" -t ${corePkg}@`,
        ],
      },
      '_release:plugin': {
        command: [
          'vp check',
          `vpr -t ${pluginPkg}#build`,
          `vpr -t ${pluginPkg}#test`,
          `vp exec -F ${pluginPkg} bumpp -c "release ${pluginPkg}@" -t ${pluginPkg}@`,
        ],
      },
      '_release:types': {
        command: [
          'vp check',
          `vp exec -F ${typesPkg} bumpp -c "release ${typesPkg}@" -t ${typesPkg}@`,
        ],
      },
    },
  },
})
