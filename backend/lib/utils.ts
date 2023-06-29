import { randomInt } from "crypto"

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~"

async function generateToken(length = 48) {
  let result = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(ALPHABET.length)
    result += ALPHABET.charAt(randomIndex)
  }
  return result
}

export default { generateToken }
