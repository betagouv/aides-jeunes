import axios from "axios"
import { answerLayout } from "@/../lib/types/answer.js"
import config from "../config/index.js"

const fcRoot = config.franceConnect.root
const fcClientId = config.franceConnect.clientId
const fcClientSecret = config.franceConnect.clientSecret
const fcScopes = config.franceConnect.scopes

interface payloadLayout {
  simulation?: any
  mesri?: any
  token?: any
  userinfo?: any
  logout?: string
}

export default function (api) {
  /*api.route("/auth").get((req, res) => {
    res.json({
      baseURL: config.baseURL,
    })
  })*/

  api.route("/auth/login").get(async (req, res) => {
    res.redirect(
      `${fcRoot}/api/v1/authorize?response_type=code&client_id=${fcClientId}&redirect_uri=http://localhost:8080/callback&scope=${fcScopes}&state=STATE&nonce=NONCE`
    )
  })

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
      const data: payloadLayout = {
        simulation: null,
        mesri: {},
        token: response.data,
        userinfo: userinfo.data,
        logout: `${fcRoot}/api/v1/logout?id_token_hint=${response.data.id_token}&state=STATE&post_logout_redirect_uri=http://localhost:8080/logout-callback`,
      }

      try {
        const mesri = { data: "none" } /*await axios.get(
          `https://particulier-test.api.gouv.fr/api/v2/etudiants`,
          {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`,
            },
          }
        )//*/
        data.mesri = mesri.data
      } catch (error: any) {
        data.mesri = {
          error,
        }
      }

      const answers: answerLayout[] = []
      answers.push({
        entityName: "franceconnect",
        fieldName: "userinfo",
        value: {
          userinfo: userinfo.data,
        },
      })
      answers.push({
        entityName: "individu",
        id: "demandeur",
        fieldName: "date_naissance",
        value: userinfo.data.birthdate,
      })

      const simulation = await axios.post(
        `${process.env.MES_AIDES_ROOT_URL}/api/simulation`,
        {
          dateDeValeur: new Date(),
          answers: {
            all: answers,
            current: [],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      data.simulation = simulation.data

      res.json(data)
    } catch (e: any) {
      console.log(e)
      res.json({ error: e.toString() })
    }
  })
}
