import express, { Express } from "express"
import { getQuestions } from "../controllers/questions.js"

export default function (api: Express) {
  const route = express.Router({ mergeParams: true })
  route.get("", getQuestions)

  api.use("/questions", route)
}
