import axios from "axios"
import { Express } from "express"

export default function (api: Express) {
  // Express 4 ignore la promesse renvoyée par un gestionnaire : sans `next`, un
  // échec de démarches-simplifiées.fr devient un `unhandledRejection` et laisse
  // la requête pendante.
  api.route("/proxy/ds").get(async (req, res, next) => {
    try {
      const dataURL = `${process.env.MES_AIDES_ROOT_URL}/api/simulation/via/${req.query.token}`
      const dataResponse = await axios.get(dataURL)
      const { data, teleservice } = dataResponse.data

      const postResponse = await axios.post(
        `https://www.demarches-simplifiees.fr/api/public/v1/demarches/${teleservice.id}/dossiers`,
        data,
      )
      const postData = postResponse.data

      res.redirect(postData.dossier_url)
    } catch (error) {
      next(error)
    }
  })
}
