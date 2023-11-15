import axios from "axios"
import config from "../../../config/index.js"

export async function renderAndSendSimulationResultsSms(followup) {
  try {
    const username = config.smsService.username
    const password = config.smsService.password
    if (!username || !password) {
      throw new Error("Missing SMS service credentials")
    }
    const renderUrl = followup.renderSimulationResultsSmsUrl(username, password)
    const axiosInstance = axios.create({
      timeout: 10000,
    })
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
