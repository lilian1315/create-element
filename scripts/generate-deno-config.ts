/// <reference types="@types/node" />

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { format } from 'vite-plus/fmt'
import { parse } from 'yaml'

import viteConfig from '../vite.config.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const denoConfigPath = resolve(root, 'deno.json')
const workspacePath = resolve(root, 'pnpm-workspace.yaml')

const workspace = parse(readFileSync(workspacePath, 'utf8'))

const workspacePackages = readdirSync(resolve(root, 'packages'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const directory = resolve(root, 'packages', entry.name)
    return {
      manifest: JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8')),
      jsr: JSON.parse(readFileSync(resolve(directory, 'jsr.json'), 'utf8')),
    }
  })
const dependencies = workspacePackages.flatMap(({ manifest }) =>
  Object.entries({ ...manifest.dependencies, ...manifest.peerDependencies }),
)
const workspaceImports = Object.fromEntries(
  dependencies
    .filter(([, requirement]) => String(requirement).startsWith('workspace:'))
    .map(([name]) => {
      const dependency = workspacePackages.find(({ manifest }) => manifest.name === name)
      if (!dependency) throw new Error(`Missing workspace package for ${name}`)
      return [name, `jsr:${dependency.jsr.name}@^${dependency.jsr.version}`]
    }),
)
const npmImports = Object.fromEntries(
  dependencies
    .filter(([, requirement]) => requirement === 'catalog:')
    .map(([name]) => {
      const version = workspace.catalog[name]
      if (typeof version !== 'string') throw new Error(`Missing catalog version for ${name}`)
      return [name, `npm:${name}@${version}`]
    }),
)

const expectedConfig = {
  $schema:
    'https://raw.githubusercontent.com/denoland/deno/refs/heads/main/cli/schemas/config-file.v1.json',
  workspace: ['packages/*'],
  imports: { ...workspaceImports, ...npmImports },
}

const expected = await format('deno.json', JSON.stringify(expectedConfig), viteConfig.fmt)
writeFileSync(denoConfigPath, expected.code)
