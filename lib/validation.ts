import config from "../backend/config/index.js"

export function phoneNumberValidation(phone: string) {
  const diallingCodes = config.smsService.internationalDiallingCodes.join("|")
  const phoneRegex = new RegExp(
    `^(((\\+?|00)(${diallingCodes})|0)[1-9])(\\d{8})$`
  )
  return phoneRegex.test(phone)
}
