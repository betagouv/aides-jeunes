export function phoneNumberValidation(
  phone: string,
  internationalDiallingCodes: string[]
) {
  const diallingCodes = internationalDiallingCodes.join("|")
  const phoneRegex = new RegExp(
    `^(((\\+?|00)(${diallingCodes})|0)[1-9])(\\d{8})$`
  )
  return phoneRegex.test(phone)
}

export function phoneNumberFormatting(
  phone: string,
  internationalDiallingCodes: string[]
) {
  const isInternational = internationalDiallingCodes.some((code) =>
    phone.startsWith(`00${code}`)
  )
  if (isInternational) {
    return phone.substring(2)
  }

  if (phone.startsWith("06") || phone.startsWith("07")) {
    return `33${phone.substring(1)}`
  }

  return phone
}
