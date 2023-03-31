import axios from "axios"

const storage = {}
const fcRoot = "https://fcp.integ01.dev-franceconnect.fr"
const fcClientId =
  "211286433e39cce01db448d80181bdfd005554b19cd51b3fe7943f6b3b86ab6e"
const fcClientSecret =
  "2791a731e6a59f56b6b4dd0d08c9b1f593b5f3658b9fd731cb24248e2669af4b"
const fcScopes = [
  "openid",
  "profile",
  "mesri_identifiant",
  "mesri_inscription_etudiant",
  "mesri_inscription_autre",
  "mesri_admission",
  "mesri_etablissements",
].join(" ")
const code = ""
const token = ""
const userinfo = ""
const id_token_hint = ""

export default function (api) {
  api.route("/auth/callback").get(async (req, res) => {
    try {
      const response = await axios.post(
        `${fcRoot}/api/v1/token`,
        {
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:8080/callback",
          client_id: fcClientId,
          client_secret: fcClientSecret,
          code: req.query.code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const userinfo = await axios.get(
        `${fcRoot}/api/v1/userinfo?schema=openid`,
        {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        }
      )

      const data = {
        mesri: {},
        token: response.data,
        userinfo: userinfo.data,
        logout: `${fcRoot}/api/v1/logout?id_token_hint=${response.data.id_token}&state=STATE&post_logout_redirect_uri=http://localhost:8080/logout-callback`,
      }

      try {
        const mesri = await axios.get(
          `https://particulier-test.api.gouv.fr/api/v2/etudiants`,
          {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          }
        )
        data.mesri = mesri.data
      } catch (error) {
        data.mesri = {
          error,
        }
      }

      res.json(data)
    } catch (e) {
      console.log(e)
      res.json({ error: e })
    }
  })
  api.route("/auth/login").get(async (req, res) => {
    res.redirect(
      `${fcRoot}/api/v1/authorize?response_type=code&client_id=${fcClientId}&redirect_uri=http://localhost:8080/callback&scope=${fcScopes}&state=STATE&nonce=NONCE`
    )
  })
}
