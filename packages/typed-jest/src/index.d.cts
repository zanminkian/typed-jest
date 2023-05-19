import {
  jest as Jest,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  fdescribe,
  fit,
  it,
  test,
  xdescribe,
  xit,
  xtest,
} from '@jest/globals'
import supertest from 'supertest'

export {
  expect,
  it,
  test,
  fit,
  xit,
  xtest,
  describe,
  xdescribe,
  fdescribe,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  supertest,
}

declare global {
  const jest: typeof Jest
}
