import crypto from "crypto"

async function generateToken(lengthInBytes = 48) {
  const bytes = await crypto.randomBytes(lengthInBytes)
  return bytes.toString("base64").replace(/\//g, "_").replace(/\+/g, "-")
}

export default { generateToken }
