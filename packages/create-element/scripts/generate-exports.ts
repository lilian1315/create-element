import { readFileSync, writeFileSync } from 'node:fs'

import { publicExports } from './entries.ts'

for (const name of ['package.json', 'jsr.json']) {
  const file = new URL('../' + name, import.meta.url)
  const manifest = JSON.parse(readFileSync(file, 'utf8'))
  const previousExports = JSON.stringify(manifest.exports)
  manifest.exports = {
    ...publicExports,
    ...(name === 'package.json' ? { './package.json': './package.json' } : {}),
  }
  if (previousExports === JSON.stringify(manifest.exports)) continue
  const content = JSON.stringify(manifest, null, 2) + '\n'
  if (readFileSync(file, 'utf8') !== content) writeFileSync(file, content)
}
