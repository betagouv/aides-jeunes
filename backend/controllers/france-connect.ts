import axios from "axios"
import jwt from "jsonwebtoken"

import { answerLayout } from "@/../lib/types/answer.js"
import config from "../config/index.js"
import utils from "../lib/utils.js"

const fcRoot = config.franceConnect.root
const fcClientId = config.franceConnect.clientId
const fcClientSecret = config.franceConnect.clientSecret
const fcScopes = config.franceConnect.scopes

interface payloadLayout {
  simulation?: any
}

export async function login(req, res) {
  const state = await utils.generateToken()
  const nonce = await utils.generateToken()
  res.cookie("fc_state", state)
  res.cookie("fc_nonce", nonce)
  res.redirect(
    `${fcRoot}/api/v1/authorize?response_type=code&client_id=${fcClientId}&redirect_uri=${config.baseURL}/callback&scope=${fcScopes}&state=${state}&nonce=${nonce}`
  )
}

export async function logout(req, res) {
  const idToken = req.cookies["fc_id_token_hint"]
  res.clearCookie("fc_id_token_hint")

  const logoutState = await utils.generateToken()
  res.cookie("fc_logout_state", logoutState)
  res.redirect(
    `${fcRoot}/api/v1/logout?id_token_hint=${idToken}&state=${logoutState}&post_logout_redirect_uri=${config.baseURL}/logout-callback`
  )
}

export function logoutCallback(req, res) {
  const originalState = req.cookies["fc_logout_state"]
  res.clearCookie("fc_logout_state")
  if (req.query.state !== originalState) {
    res.redirect("/?message=Déconnection FC KO!")
  }
  res.redirect("/?message=Déconnection FC OK!")
}

export async function callback(req, res, next) {
  const originalState = req.cookies["fc_state"]
  res.clearCookie("fc_state")
  if (req.query.state !== originalState) {
    return res.json({
      error: "state is not correct",
      type: "state",
    })
  }

  try {
    const response = await axios.post(
      `${fcRoot}/api/v1/token`,
      {
        grant_type: "authorization_code",
        redirect_uri: `${config.baseURL}/callback`,
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
    console.log(response.data)

    jwt.verify(response.data.id_token, fcClientSecret, (err, decoded) => {
      console.log(err, decoded)
      if (err) {
        return res.json({
          error: "id_token can't be veririfed",
          type: "id_token",
        })
      }

      const originalNonce = req.cookies["fc_nonce"]
      res.clearCookie("fc_nonce")

      if (decoded.nonce !== originalNonce) {
        return res.json({
          error: "nonce is not correct",
          type: "nonce",
        })
      }

      res.cookie("fc_id_token_hint", response.data.id_token)
      req.FCToken = response.data.access_token
      req.FCIDToken = decoded
      next()
    })
  } catch (e: any) {
    console.error(e)
    res.json({ error: e.toString() })
  }
}

export async function fetchUserInfo(req, res) {
  try {
    const userinfo = await axios.get(
      `${fcRoot}/api/v1/userinfo?schema=openid`,
      {
        headers: {
          Authorization: `Bearer ${req.FCToken}`,
        },
      }
    )

    req.FCUserinfo = userinfo.data.data

    const data: payloadLayout = {
      simulation: null,
    }

    try {
      const mesri = await axios.get(
        `https://staging.particulier.api.gouv.fr/api/v2/etudiants`,
        {
          headers: {
            Authorization: `Bearer ${req.fc_token}`,
          },
        }
      )
    } catch (error: any) {
      console.error(error)
    }

    const answers: answerLayout[] = []
    answers.push({
      entityName: "franceconnect",
      fieldName: "userinfo",
      value: userinfo.data,
    })
    answers.push({
      entityName: "franceconnect",
      fieldName: "idtoken",
      value: req.FCIDToken,
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
    console.error(e)
    res.json({ error: e.toString() })
  }
}
