import mongoose from "mongoose"
import { MongooseLayout } from "../types/models"
import { SurveyType } from "../types/survey.d"

const SurveySchema = new mongoose.Schema<MongooseLayout>(
  {
    _oldId: { type: String },
    accessToken: { type: String },
    createdAt: { type: Date, default: Date.now },
    messageId: { type: String },
    repliedAt: { type: Date },
    error: { type: Object },
    answers: [
      {
        id: String,
        value: String,
        comments: String,
      },
    ],
    type: {
      type: String,
      enum: [
        SurveyType.benefitAction,
        SurveyType.simulationUsefulness,
        SurveyType.trackClicBenefitActionEmail,
      ],
    },
  },
  { minimize: false, id: false }
)

export default SurveySchema
