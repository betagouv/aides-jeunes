var mongoose = require("mongoose")

const answer = {
  entityName: String,
  fieldName: String,
  id: String,
  value: Object,
}

var AnswerSchema = new mongoose.Schema(
  {
    all: [answer],
    current: [answer],
    enfants: [Number],
    ressourceFiscales: Object,
    patrimoine: Object,
    dateDeValeur: Date,
    version: Number,
  },
  { minimize: false }
)

mongoose.model("Answer", AnswerSchema)
