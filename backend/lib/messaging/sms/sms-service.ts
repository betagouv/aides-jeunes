import axios from "axios"
import config from "../../../config/index.js"
import { phoneNumberFormatting } from "./../../../../lib/phone-number.js"
import { SmsCategory } from "../../../../lib/enums/messaging.js"

async function getSMSConfig() {
  const { username, password } = config.smsService

  if (!username || !password) {
    throw new Error("Missing SMS service credentials")
  }

  return { username, password }
}

async function createAxiosInstance() {
  return axios.create({
    timeout: 10000,
  })
}

function buildSmsUrl({ accessToken, phone, username, password, smsCategory }) {
  const { baseURL } = config
  const { url } = config.smsService
  const formattedPhone = phoneNumberFormatting(
    phone,
    config.smsService.internationalDiallingCodes
  )

  let text, surveyLink
  switch (smsCategory) {
    case SmsCategory.SimulationResults:
      text = `Bonjour\nRetrouvez les résultats de votre simulation ici ${baseURL}/api/sms/${accessToken}\n1jeune1solution`
      break
    case SmsCategory.InitialSurvey:
      surveyLink = `${baseURL}/api/r/${accessToken}`
      text = `Bonjour\nVotre simulation sur 1jeune1solution.gouv.fr vous a-t-elle été utile?\nVoici un court sondage : ${surveyLink}\n1jeune1solution`
      break
    default:
      throw new Error(`Unknown SMS type: ${smsCategory}`)
  }

  const encodedText = encodeURIComponent(text)
  return `${url}?&originatorTON=1&originatingAddress=SIMUL 1J1S&destinationAddress=${formattedPhone}&messageText=${encodedText}&username=${username}&password=${password}`
}

export async function sendSms(smsCategory: SmsCategory, followup) {
  try {
    const { username, password } = await getSMSConfig()
    const { phone, accessToken } = followup
    const smsUrl = buildSmsUrl({
      accessToken,
      phone,
      username,
      password,
      smsCategory,
    })
    const axiosInstance = await createAxiosInstance()
    const { data, status } = await axiosInstance.get(smsUrl)
    if (status !== 200 || data.responseCode !== 0) {
      throw new Error(`SMS request failed. Body: ${JSON.stringify(data)}`)
    }

    switch (smsCategory) {
      case SmsCategory.SimulationResults:
        followup.smsSentAt = Date.now()
        followup.smsMessageId = data.messageIds[0]
        if (!followup.surveyOptin) {
          followup.phone = undefined
        }
        followup.smsError = undefined
        break
      case SmsCategory.InitialSurvey:
        followup.smsSurveySentAt = Date.now()
        followup.smsSurveyMessageId = data.messageIds[0]
        followup.smsSurveyError = undefined
        break
      default:
        break
    }

    return followup.save()
  } catch (err) {
    console.error(err)
    throw err
  }
}
