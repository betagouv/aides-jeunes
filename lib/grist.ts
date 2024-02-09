import axios from "axios"
import { GristResponse } from "./types/link-validity.js"

const baseURL = "grist.incubateur.net"
const tableId = "Veille"

export function Grist(docId, apiKey) {
  const apiUrl = `https://${baseURL}/api`
  const docUrl = `${apiUrl}/docs/${docId}`
  const recordsUrl = `${docUrl}/tables/${tableId}/records`
  const gristConfig = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  }

  const g = {
    me: async () => {
      const response = await axios.get<GristResponse>(
        `${apiUrl}/profile/user`,
        gristConfig
      )
      return response.data
    },
    get: async (filter?: any) => {
      let url = recordsUrl
      if (filter) {
        url += "?filter=" + JSON.stringify(filter)
      }
      const response = await axios.get<GristResponse>(url, gristConfig)
      return response.data
    },
    add: async (records) => {
      const response = await axios.post<GristResponse>(
        recordsUrl,
        { records },
        gristConfig
      )
      return response.data
    },
    update: async (records) => {
      const response = await axios.patch<GristResponse>(
        recordsUrl,
        { records },
        gristConfig
      )
      return response.data
    },
  }
  return g
}
