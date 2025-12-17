import axios from "axios"
import { Express } from "express"
import config from "../config/index.js"

export default function (api: Express) {
  api.route("/lieux/ccas/:codeCommune").get(async (req, res) => {
    try {
      const { codeCommune } = req.params
      const url = `${config.dataInclusion.url}/structures?sources=ma-boussole-aidants&reseaux_porteurs=ccas-cias&code_commune=${codeCommune}`

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${config.dataInclusion.token}`,
        },
      })

      res.json(response.data)
    } catch (error) {
      console.error("Error fetching CCAS/CIAS structures:", error)
      res.status(500).json({ error: "Failed to fetch structures" })
    }
  })
}
