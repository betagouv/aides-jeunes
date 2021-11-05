const SibApiV3Sdk = require("sib-api-v3-sdk")
const defaultClient = SibApiV3Sdk.ApiClient.instance
const config = require("../config")

exports.SendSmtpEmail = SibApiV3Sdk.SendSmtpEmail
exports.sendEmail = function (sendSmtpEmail) {
  const apiKey = defaultClient.authentications["api-key"]
  apiKey.apiKey = config.sendInBlue.apiKey
  const partnerKey = defaultClient.authentications["partner-key"]
  partnerKey.apiKey = config.sendInBlue.apiKey

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

  sendSmtpEmail.sender = {
    name: "Équipe du simulateur 1jeune1solution.gouv.fr",
    email: "aides-jeunes@beta.gouv.fr",
  }
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}
