import express from "express"

import {
  verifyAuthentication,
  validateRequestPayload,
  postOnMattermost,
} from "../controllers/webhook.js"

const webhookRoutes = function (api: express.Express) {
  api.post(
    "/webhook/rdv",
    express.raw({ type: "*/*" }),
    verifyAuthentication,
    validateRequestPayload,
    postOnMattermost
  )
}
export default webhookRoutes
