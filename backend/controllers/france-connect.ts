import utils from "../lib/utils.js"
import {
  FranceConnectService,
  CookiesKeys,
} from "../lib/france-connect-service.js"

export async function login(request, response) {
  const stateToken = await utils.generateToken()
  const nonceToken = await utils.generateToken()

  response.cookie(CookiesKeys.fcState, stateToken)
  response.cookie(CookiesKeys.fcNonce, nonceToken)

  response.redirect(
    FranceConnectService.generateLoginRedirectURL(stateToken, nonceToken)
  )
}

export async function callback(request, response, next) {
  try {
    const cookieStateToken = request.cookies[CookiesKeys.fcState]
    response.clearCookie(CookiesKeys.fcState)
    const queryStateToken = request.query.state

    if (queryStateToken !== cookieStateToken) {
      throw new Error("state is not correct")
    }

    const nonceToken = request.cookies[CookiesKeys.fcNonce]
    response.clearCookie(CookiesKeys.fcNonce)

    const { accessToken, idToken } =
      await FranceConnectService.retrieveAccessToken(
        request.query.code,
        nonceToken
      )

    response.cookie(CookiesKeys.fcIdTokenHint, idToken)
    request.FCToken = accessToken
    request.FCIDToken = idToken

    next()
  } catch (error) {
    console.error(error)
    response.status(503).json({ error })
  }
}

export async function fetchUserInfo(request, response) {
  try {
    const answers = await FranceConnectService.retrieveUserAnswers(
      request.FCToken,
      request.FCIDToken
    )

    const simulation = await FranceConnectService.createSimulationFromAnswer(
      answers
    )

    response.json({ simulation })
  } catch (error) {
    console.error(error)
    response.status(503).json({ error })
  }
}

export async function logout(request, response) {
  const idToken = request.cookies[CookiesKeys.fcIdTokenHint]
  response.clearCookie(CookiesKeys.fcIdTokenHint)

  const logoutStateToken = await utils.generateToken()
  response.cookie(CookiesKeys.fcLogoutState, logoutStateToken)
  response.redirect(
    FranceConnectService.generateLogoutRedirectURL(idToken, logoutStateToken)
  )
}

export function logoutCallback(request, response) {
  const cookieStateToken = request.cookies[CookiesKeys.fcLogoutState]
  response.clearCookie(CookiesKeys.fcLogoutState)
  const queryStateToken = request.query.state

  if (queryStateToken !== cookieStateToken) {
    return response.redirect("/?message=Déconnection FC KO!")
  }

  response.redirect("/?message=Déconnection FC OK!")
}
