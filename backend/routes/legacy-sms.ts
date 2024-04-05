import { Express } from "express"

export default function (api: Express) {
  api
    .route("/sms/:accessToken")
    .get((req, res) => res.redirect(`/s/r/${req.params.accessToken}`))
  api.route("/r/:accessToken").get((req, res) => {
    res.redirect(`/s/s/${req.params.accessToken}`)
  })
}
