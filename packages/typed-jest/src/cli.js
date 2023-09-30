// @ts-check
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { cosmiconfigSync } from "cosmiconfig";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const requireResolve = createRequire(import.meta.url).resolve;

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {unknown} configPath
 */
async function getFileConfig(configPath) {
  if (typeof configPath === "string") {
    // eslint-disable-next-line @git-validator/no-dynamic-import
    const config = await import(resolve(process.cwd(), configPath));
    if (config.default) {
      return config.default;
    }
    return config;
  } else {
    return cosmiconfigSync("jest").search(join(__dirname, ".."))?.config ?? {};
  }
}

export async function getConfigs() {
  const { argv } = yargs(hideBin(process.argv));
  const cliConfig = argv instanceof Promise ? await argv : argv;
  const configPath = cliConfig["config"] || cliConfig["c"];
  const fileConfig = await getFileConfig(configPath);

  /**
   * @type {([string]|[string,string])[]}
   */
  const defaultConfigs = [
    ["transform", `{"^.+\\\\.tsx?$":"${requireResolve("ts-jest")}"}`],
    ["passWithNoTests"],
    ["collectCoverageFrom", "**/src/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
  ];
  return defaultConfigs.reduce(
    /**
     * @param {string[]} res
     */
    (res, cur) =>
      fileConfig[cur[0]] === undefined && cliConfig[cur[0]] === undefined
        ? res.concat(`--${cur.join("=")}`)
        : res,
    [],
  );
}
