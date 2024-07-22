import crypto from "crypto"

import config from "../config/index.js"
import Mattermost from "../lib/mattermost-bot/mattermost.js"
import { Request, Response, NextFunction } from "express"
import { RequestBody, Data } from "../types/rdv-aide-numerique.js"
import Sentry from "@sentry/node"

export const verifyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const signature = req.get("X-Lapin-Signature")
  if (!signature) {
    res.status(401).json({ error: "Signature required" })
    return
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", config.rdvAideNumerique.sharedSecret)
      .update(req.body as any)
      .digest("hex")

    if (signature !== expectedSignature) {
      res.status(401).json({ error: "Invalid signature" })
      return
    }
  } catch (error) {
    Sentry.captureException(error)
    console.error("Error while verifying signature", error)
    res.status(401).json({ error: "Invalid signature" })
    return
  }

  next()
}

const shouldProcessEvent = (body: RequestBody): boolean => {
  return !!(
    body &&
    body.meta &&
    body.meta.model === "Rdv" &&
    body.meta.event === "created" &&
    body.data
  )
}

const isValidData = (data: Data): boolean => {
  return !!(
    data &&
    data.users &&
    data.users[0] &&
    typeof data.users[0].email === "string" &&
    data.id &&
    data.organisation &&
    data.organisation.id
  )
}

export const validateRequestPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.body = JSON.parse(req.body.toString())
  if (!shouldProcessEvent(req.body)) {
    res.status(400).json({ error: "Event not supported" })
    return
  }

  const { data } = req.body
  if (!isValidData(data)) {
    console.error("Invalid data in payload", data)
    res.status(400).json({ error: "Invalid data in payload" })
    return
  }

  next()
}

export async function postOnMattermost(
  req: Request,
  res: Response
): Promise<Response> {
  const { id: rdvId, organisation } = req.body.data || {}
  const { id: organisationId } = organisation || {}

  const message = `Une personne vient de prendre RDV.
Plus d'informations ${config.rdvAideNumerique.baseUrl}/admin/organisations/${organisationId}/rdvs/${rdvId}`

  await Mattermost.post(message)
  return res.status(200).json({ message: "OK" })
}
