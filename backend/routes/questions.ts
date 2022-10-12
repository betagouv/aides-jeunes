import express from "express"
import { getQuestions } from "../controllers/questions"

export default function (api) {
  const route = express.Router({ mergeParams: true })
  route.get("", getQuestions)

  api.use("/questions", route)
}
