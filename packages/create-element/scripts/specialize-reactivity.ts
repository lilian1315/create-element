import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { TsdownPlugin } from 'vite-plus/pack'

import { integrations } from './entries'

export { integrations } from './entries'

type Integration = (typeof integrations)[number]

const reactivityModule = fileURLToPath(new URL('../src/reactivity-ops/index.ts', import.meta.url))

/** Selects the same native primitives and source type for JS and declarations. */
export function specializeReactivity(integration?: Integration): TsdownPlugin {
  const specializedModule = integration
    ? resolve(dirname(reactivityModule), `${integration}.ts`)
    : reactivityModule

  return {
    name: `specialize-reactivity:${integration ?? 'plain'}`,
    async resolveId(source, importer) {
      if (!source.startsWith('.')) return
      const resolved = await this.resolve(source, importer, { skipSelf: true })
      if (resolved && !resolved.external && resolve(resolved.id) === reactivityModule) {
        return { id: specializedModule, moduleSideEffects: false }
      }
    },
    // The declaration resolver resolves TS imports independently of resolveId.
    // Rewrite the module reference before it resolves the emitted declarations.
    transform(code, id) {
      if (!integration || !id.endsWith('.d.ts')) return
      const specialized = code.replace(
        /(['"])(\.{1,2}\/(?:[^'"]*\/)?reactivity-ops)(?:\/index)?(?:\.[jt]s)?\1/g,
        (match: string, quote: string, specifier: string) =>
          resolve(dirname(id), specifier, 'index.ts') === reactivityModule
            ? `${quote}${specifier}/${integration}.ts${quote}`
            : match,
      )
      if (specialized !== code) return { code: specialized, map: null }
    },
  }
}

/** JSR consumes the same specialized output and types as npm. */
export function jsrEntryTypes(): TsdownPlugin {
  return {
    name: 'jsr-entry-types',
    outputOptions(options) {
      return {
        ...options,
        banner(chunk) {
          if (!chunk.isEntry || !chunk.fileName.endsWith('.js')) return ''
          const declaration = basename(chunk.fileName).replace(/\.js$/, '.d.ts')
          return `/* @ts-self-types="./${declaration}" */`
        },
      }
    },
  }
}
