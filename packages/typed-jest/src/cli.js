// @ts-check
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { lilconfig } from "lilconfig";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const tsJestPath = createRequire(import.meta.url).resolve("ts-jest");

/**
 * @param {unknown} configPath
 */
async function getFileConfig(configPath) {
  if (typeof configPath === "string") {
    // eslint-disable-next-line @git-validator/no-dynamic-import
    const config = await import(path.resolve(process.cwd(), configPath));
    return config.default ?? config;
  } else {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const config = await lilconfig("jest").search(path.join(__dirname, ".."));
    return config?.config ?? {};
  }
}

export async function getConfigs() {
  const cliConfig = await yargs(hideBin(process.argv)).argv;
  const fileConfig = await getFileConfig(cliConfig["config"] || cliConfig["c"]);

  /**
   * @type {([string]|[string,string])[]}
   */
  const defaultConfigs = [
    ["transform", `{"^.+\\\\.tsx?$":"${tsJestPath}"}`],
    ["passWithNoTests"],
    ["collectCoverageFrom", "**/src/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"], // TODO collecting coverage from src folder is not the best choice.
  ];
  return defaultConfigs
    .filter(([key]) => !(key in cliConfig) && !(key in fileConfig))
    .map((config) => `--${config.join("=")}`);
}
