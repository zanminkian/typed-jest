import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { cosmiconfigSync } from 'cosmiconfig'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function getTsJestPath(basePath = __dirname) {
  const result = resolve(basePath, 'node_modules/ts-jest')
  const isDir = (await stat(result).catch(() => undefined))?.isDirectory()
  if (isDir)
    return result
  if (basePath === '/')
    return 'ts-jest'
  return await getTsJestPath(resolve(basePath, '..'))
}

export async function getConfigs() {
  const { argv } = yargs(hideBin(process.argv))
  const cliConfig = argv instanceof Promise ? await argv : argv
  const configPath = cliConfig['config'] || cliConfig['c']
  const fileConfig = typeof configPath === 'string' ? require(resolve(process.cwd(), configPath)) : cosmiconfigSync('jest').search(join(__dirname, '..'))?.config ?? {}

  const result = [
    ['transform', `{"^.+\\\\.tsx?$":"${await getTsJestPath()}"}`],
    ['passWithNoTests'],
    ['collectCoverageFrom', '**/src/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
  ].reduce(
    (res, cur) => (fileConfig[cur[0]] === undefined && cliConfig[cur[0]] === undefined) ? res.concat(`--${cur.join('=')}`) : res,
    [],
  )

  return result
}
