const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~"

async function generateToken(lengthInBytes = 48) {
  let result = ""
  for (let i = 0; i < lengthInBytes; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length)
    result += ALPHABET.charAt(randomIndex)
  }
  return result
}

export default { generateToken }
