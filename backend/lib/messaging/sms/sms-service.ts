import axios from "axios"
import config from "../../../config/index.js"

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

export async function renderAndSendSimulationResultsSms(followup) {
  try {
    const { username, password } = await getSMSConfig()
    const renderUrl = followup.renderSimulationResultsSmsUrl(username, password)
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
