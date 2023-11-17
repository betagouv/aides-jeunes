import mongoose from "mongoose"
import validator from "validator"
import { Followup } from "../../lib/types/followup.d.js"
import { FollowupModel } from "../types/models.d.js"
import SurveySchema from "./survey-schema.js"

const FollowupSchema = new mongoose.Schema<Followup, FollowupModel>(
  {
    simulation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Simulation",
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "Email invalide",
        isAsync: false,
      },
    },
    phone: {
      type: String,
      validate: {
        validator: validator.isMobilePhone,
        message: "Numéro de téléphone invalide",
        isAsync: false,
      },
    },
    createdAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    messageId: { type: String },
    surveySentAt: { type: Date },
    smsSentAt: { type: Date },
    smsMessageId: { type: String },
    smsSurveySentAt: { type: Date },
    smsSurveyMessageId: { type: String },
    smsSurveyError: { type: Object },
    benefits: { type: Object },
    surveyOptin: { type: Boolean, default: false },
    surveys: {
      type: [SurveySchema],
      default: [],
    },
    version: Number,
    error: { type: Object },
    smsError: { type: Object },
    accessToken: { type: String },
  },
  { minimize: false, id: false }
)

export default FollowupSchema
