var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var config = require('../config');

exports.SendSmtpEmail = SibApiV3Sdk.SendSmtpEmail
exports.sendEmail = function(sendSmtpEmail) {
  var apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = config.sendInBlue.apiKey;
  var partnerKey = defaultClient.authentications['partner-key'];
  partnerKey.apiKey = config.sendInBlue.apiKey;

  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  sendSmtpEmail.sender = {
    name: 'Équipe Mes Aides',
    email: 'equipe@mes-aides.org'
  }
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}
