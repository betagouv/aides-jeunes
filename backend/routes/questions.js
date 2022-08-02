const express = require("express")
const questionsController = require("../controllers/questions")

module.exports = function (api) {
  const route = new express.Router({ mergeParams: true })
  route.get("", questionsController.getQuestions)

  api.use("/questions", route)
}
