import axios from "axios"
import config from "../../../config/index.js"
import { phoneNumberFormatting } from "./../../../../lib/phone-number.js"
import { SmsType } from "../../../../lib/enums/messaging.js"
import { Followup } from "../../../../lib/types/followup.js"
import { Survey } from "../../../../lib/types/survey.d.js"
import { SurveyType } from "../../../../lib/enums/survey.js"
import dayjs from "dayjs"

async function getSMSConfig() {
  const { username, password } = config.smsService

  if (!username || !password) {
    throw new Error("Missing SMS service credentials")
  }

  return { username, password }
}

async function createAxiosInstance() {
  const instance = axios.create({
    timeout: 10000,
  })
  instance.interceptors.response.use(
    (response) => {
      const { data, status } = response
      if (status !== 200 || data.responseCode !== 0) {
        throw new Error(`SMS request failed. Body: ${JSON.stringify(data)}`)
      }
      return response
    },
    (error) => {
      throw error
    }
  )

  return instance
}

function buildSmsUrl({ accessToken, phone, username, password, smsType }) {
  const { baseURL } = config
  const { url } = config.smsService
  const formattedPhone = phoneNumberFormatting(
    phone,
    config.smsService.internationalDiallingCodes
  )

  let text, surveyLink
  switch (smsType) {
    case SmsType.SimulationResults:
      text = `Bonjour\nRetrouvez les résultats de votre simulation ici ${baseURL}/api/sms/${accessToken}\n1jeune1solution`
      break
    case SmsType.InitialSurvey:
      surveyLink = `${baseURL}/api/r/${accessToken}`
      text = `Votre simulation sur 1jeune1solution.gouv.fr vous a-t-elle été utile ? Dites-le nous : ${surveyLink}`
      break
    default:
      throw new Error(`Unknown SMS type: ${smsType}`)
  }

  const encodedText = encodeURIComponent(text)
  return `${url}?&originatorTON=1&originatingAddress=SIMUL 1J1S&destinationAddress=${formattedPhone}&messageText=${encodedText}&username=${username}&password=${password}`
}

export async function sendSimulationResultsSms(
  followup: Followup
): Promise<Followup> {
  try {
    if (!followup.phone) {
      throw new Error("Missing followup phone")
    }

    const { username, password } = await getSMSConfig()
    const { phone, accessToken } = followup
    const smsUrl = buildSmsUrl({
      accessToken,
      phone,
      username,
      password,
      smsType: SmsType.SimulationResults,
    })
    const axiosInstance = await createAxiosInstance()
    const { data } = await axiosInstance.get(smsUrl)
    followup.smsError = undefined
    if (!followup.surveyOptin) {
      followup.phone = undefined
    }
    followup.smsSentAt = dayjs().toDate()
    followup.smsMessageId = data.messageIds[0]
    return await followup.save()
  } catch (err) {
    followup.smsError = JSON.stringify(err, null, 2)
    throw err
  }
}

export async function sendSurveyBySms(followup: Followup): Promise<Survey> {
  if (!followup.phone) {
    throw new Error("Missing followup phone")
  }
  const survey = await followup.addSurveyIfMissing(
    SurveyType.TrackClickOnBenefitActionSms
  )
  const { username, password } = await getSMSConfig()
  const { phone, accessToken } = followup
  const smsUrl = buildSmsUrl({
    accessToken,
    phone,
    username,
    password,
    smsType: SmsType.InitialSurvey,
  })
  const axiosInstance = await createAxiosInstance()
  const { data } = await axiosInstance.get(smsUrl)
  survey.messageId = data.messageIds[0]
  survey.error = undefined
  survey.smsSentAt = dayjs().toDate()
  await followup.save()
  return survey
}
