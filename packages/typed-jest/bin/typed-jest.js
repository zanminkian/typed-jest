#!/usr/bin/env node
import process from "node:process";
import { getConfigs } from "../src/cli.js";

process.argv.push(...(await getConfigs()));

await import("jest/bin/jest");
