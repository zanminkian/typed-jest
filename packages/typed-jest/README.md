# typed-jest

[![License](https://img.shields.io/npm/l/typed-jest.svg)](https://github.com/zanminkian/typed-jest/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/typed-jest.svg)](https://www.npmjs.com/package/typed-jest)
[![Downloads](https://img.shields.io/npm/dm/typed-jest.svg)](https://www.npmjs.com/package/typed-jest)
[![Dependencies](https://img.shields.io/librariesio/release/npm/typed-jest)](https://www.npmjs.com/package/typed-jest)
[![Size](https://packagephobia.com/badge?p=typed-jest)](https://packagephobia.com/result?p=typed-jest)

An all-in-one test framework supporting TypeScript out-of-box.

## Features

- 100% compatible with [Jest](https://jestjs.io/). Use `typed-jest` just like you would use `jest`.
- Out-of-the-box TypeScript support.
- Sensible defaults adhering to best practices. Most projects work seamlessly with **zero configuration**.
- Integrated [supertest](https://www.npmjs.com/package/supertest) in it.

## Why

This is an all-in-one test framework designed for legacy **CommonJS TypesScript** project, supporting `experimentalDecorators` and `emitDecoratorMetadata`. For modern **ESM** project, you should consider to use [Vitest](https://vitest.dev/).

## Usage

1. Uninstall `jest`, `@types/jest`, and `ts-jest` if they are already installed in your project.

```sh
pnpm remove jest @types/jest ts-jest
```

2. Install `typed-jest`.

```sh
pnpm add -D typed-jest
```

3. Create an `app.ts` file.

```typescript
import fs from "node:fs";
import express, { type Express } from "express";

const json = fs.readFileSync("package.json", "utf-8");

const app: Express = express();
app.get("/pkg", function (_req, res) {
  console.log("package.json", json);
  res.status(200).json(JSON.parse(json));
});

export default app;
```

4. Create an `app.spec.ts` file.

```typescript
import { describe, it, expect, beforeEach, afterEach, jest } from "typed-jest";
import supertest from "typed-jest/supertest";
import app from "./app";

jest.mock("node:fs", () => ({
  readFileSync: () => JSON.stringify({ foo: "bar" }),
}));

describe("app", () => {
  beforeEach(() => {
    console.log("========beforeEach running========");
  });
  afterEach(() => {
    console.log("========afterEach running========");
  });
  it("should be 2", () => {
    expect(1 + 1).toBe(2);
  });
  it("should success", async () => {
    const response = await supertest(app).get("/pkg");
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({ foo: "bar" });
  });
});
```

5. Run `pnpm jest` to execute tests.

> Note: For the projects using `npm` as its package manager, please use `npx typed-jest` instead.

## Configuration

1. Add more CLI configurations after the `pnpm jest` command. For example, run `pnpm jest --coverage` to collect test coverage. Run `pnpm jest -h` for more CLI options information.
2. Add a `jest.config.js` file in the root of your project. Consult the [official Jest documentation](https://jestjs.io/docs/configuration) for more information.

## How it works

If you don't include CLI options when running `pnpm jest`, we will append some sensible defaults:

- `--transform='{"^.+\\\\.tsx?$":"ts-jest"}'`: This option transforms TypeScript files, so you can support TypeScript projects without additional configurations or installations.
- `--passWithNoTests`: This option prevents the CLI from producing errors if no tests are found. You can override this default by `pnpm jest --passWithNoTests=false`.
- `--collectCoverageFrom='**/src/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'`: This option specifies the location for collecting test coverage. Override it as needed: `pnpm jest --collectCoverageFrom='**/lib/**/*.js'`

## License

MIT
