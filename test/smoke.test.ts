import { describe, expect, it } from "vitest"

// Teste de fumaça: existe para que `npm test` tenha o que rodar num repo recém-criado.
// Pode ser removido assim que houver teste de comportamento real.
describe("ambiente", () => {
  it("roda a suíte", () => {
    expect(true).toBe(true)
  })
})
