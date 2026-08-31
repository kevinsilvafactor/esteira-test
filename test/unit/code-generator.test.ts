import { describe, expect, it } from "vitest"
import { CODE_ALPHABET, CODE_LENGTH, generateCode } from "../../src/modules/links/code-generator.js"

describe("code generator", () => {
  it("generates seven characters from the unambiguous alphabet", () => {
    const code = generateCode(() => 0)
    expect(code).toHaveLength(CODE_LENGTH)
    expect(code.split("").every((character) => CODE_ALPHABET.includes(character))).toBe(true)
    expect(code).not.toMatch(/[0Ol1]/)
  })
})