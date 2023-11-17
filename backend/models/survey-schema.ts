import mongoose from "mongoose"
import { Mongoose } from "../types/models.d.js"
import { SurveyCategory } from "../../lib/enums/survey.js"
import { Survey } from "../../lib/types/survey.d.js"

const SurveySchema = new mongoose.Schema<Mongoose, Survey>(
  {
    accessToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    openedAt: { type: Date },
    messageId: { type: String },
    repliedAt: { type: Date },
    error: { type: Object },
    answers: [
      {
        id: String,
        value: mongoose.Schema.Types.Mixed,
        comments: String,
      },
    ],
    type: {
      type: String,
      enum: SurveyCategory,
    },
  },
  { minimize: false, id: false }
)

export default SurveySchema
