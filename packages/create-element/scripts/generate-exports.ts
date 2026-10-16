import { readFileSync, writeFileSync } from 'node:fs'

import { publicExports } from './entries.ts'

const file = new URL('../package.json', import.meta.url)
const manifest = JSON.parse(readFileSync(file, 'utf8'))
const previousExports = JSON.stringify(manifest.exports)
manifest.exports = {
  ...publicExports,
  './package.json': './package.json',
}
if (previousExports !== JSON.stringify(manifest.exports)) {
  const content = JSON.stringify(manifest, null, 2) + '\n'
  if (readFileSync(file, 'utf8') !== content) writeFileSync(file, content)
}
