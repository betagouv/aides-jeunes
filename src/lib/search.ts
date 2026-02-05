import { normalizeString } from "@lib/utils"

// Returns true when every query token appears in the value (accent/case/order-insensitive).
export const matchesAllTerms = (value: string, query: string) => {
  const normalizedValue = normalizeString(value)
  const tokens = normalizeString(query).split(/\s+/).filter(Boolean)
  if (!tokens.length) return true
  return tokens.every((token) => normalizedValue.includes(token))
}
