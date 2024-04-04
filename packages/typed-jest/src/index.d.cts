import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  fdescribe,
  fit,
  it,
  jest as Jest,
  test,
  xdescribe,
  xit,
  xtest,
} from "@jest/globals";
import supertest from "supertest";

export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  fdescribe,
  fit,
  it,
  supertest,
  test,
  xdescribe,
  xit,
  xtest,
};

declare global {
  const jest: typeof Jest;
}
