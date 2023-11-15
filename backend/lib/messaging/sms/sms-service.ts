import axios from "axios"
import config from "../../../config/index.js"
import { phoneNumberFormatting } from "./../../../../lib/phone-number.js"

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

function renderSimulationResultsSmsUrl(accessToken, phone, username, password) {
  const { baseURL } = config
  const { url } = config.smsService
  const formattedPhone = phoneNumberFormatting(
    phone,
    config.smsService.internationalDiallingCodes
  )
  const text = `Bonjour\nRetrouvez les résultats de votre simulation ici ${baseURL}/api/sms/${accessToken}\n1jeune1solution`
  const encodedText = encodeURIComponent(text)
  return `${url}?&originatorTON=1&originatingAddress=SIMUL 1J1S&destinationAddress=${formattedPhone}&messageText=${encodedText}&username=${username}&password=${password}`
}

export async function renderAndSendSimulationResultsSms({
  accessToken,
  phone,
}) {
  try {
    const { username, password } = await getSMSConfig()
    const renderUrl = renderSimulationResultsSmsUrl(
      accessToken,
      phone,
      username,
      password
    )
    const axiosInstance = await createAxiosInstance()
    const { data, status } = await axiosInstance.get(renderUrl)
    if (status !== 200 || data.responseCode !== 0) {
      throw new Error(`SMS request failed. Body: ${JSON.stringify(data)}`)
    }
    return data.messageIds[0]
  } catch (err) {
    console.error(err)
    throw err
  }
}
