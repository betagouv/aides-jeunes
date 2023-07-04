import { getEnvVariable } from "@lib/utils.js"

describe("getEnvVariable", () => {
  afterEach(() => {
    delete process.env.TEST_VARIABLE
  })

  it("returns the value of the specified environment variable", () => {
    process.env.TEST_VARIABLE = "testValue"
    const result = getEnvVariable("TEST_VARIABLE")
    expect(result).toBe("testValue")
  })

  it("throws an error if the specified environment variable is not defined", () => {
    expect(() => getEnvVariable("UNDEFINED_VARIABLE")).toThrowError(
      "Variable UNDEFINED_VARIABLE is not defined"
    )
  })

  it("throws an error if the specified environment variable is an empty string", () => {
    process.env.TEST_VARIABLE = ""
    expect(() => getEnvVariable("TEST_VARIABLE")).toThrowError(
      "Variable TEST_VARIABLE is not defined"
    )
  })
})
