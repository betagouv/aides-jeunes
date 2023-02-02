import axios from "axios"

export default function (api) {
  api.route("/proxy/ds/:demarche").get(async (req, res) => {
    const dataURL = `${process.env.MES_AIDES_ROOT_URL}/api/simulation/via/${req.query.token}`
    const dataResponse = await axios.get(dataURL)
    const data = dataResponse.data

    const postResponse = await axios.post(
      "https://www.demarches-simplifiees.fr/api/public/v1/demarches/69682/dossiers",
      data
    )
    const postData = postResponse.data

    res.redirect(postData.dossier_url)
  })
}
