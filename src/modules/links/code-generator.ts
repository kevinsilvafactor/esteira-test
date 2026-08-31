import { randomInt } from "node:crypto"

export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
export const CODE_LENGTH = 7

export type CodeGenerator = () => string

export function generateCode(random: (max: number) => number = randomInt): string {
  let code = ""
  for (let index = 0; index < CODE_LENGTH; index += 1) {
    code += CODE_ALPHABET[random(CODE_ALPHABET.length)]
  }
  return code
}