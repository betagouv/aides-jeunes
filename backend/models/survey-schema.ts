import mongoose from "mongoose"
import { Mongoose } from "../types/models.d.js"
import { SurveyType } from "../../lib/enums/survey.js"
import { Survey } from "../../lib/types/survey.d.js"

const SurveySchema = new mongoose.Schema<Mongoose, Survey>(
  {
    accessToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    messageId: { type: String },
    repliedAt: { type: Date },
    touchedAts: [{ type: Date }],
    smsSentAt: { type: Date },
    error: { type: Object },
    answers: [
      {
        id: String,
        value: mongoose.Schema.Types.Mixed,
        comments: String,
        plansToAsk: { type: Boolean, required: false },
      },
    ],
    type: {
      type: String,
      enum: SurveyType,
    },
  },
  { minimize: false, id: false }
)

export default SurveySchema
