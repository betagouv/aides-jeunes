import mongoose from "mongoose"
import type { Contribution } from "../../lib/types/contributions.d.js"
import { ContributionModel } from "../types/models.d.js"

const ContributionSchema = new mongoose.Schema<Contribution, ContributionModel>(
  {
    type: {
      type: String,
      enum: ["benefit", "institution"],
      required: true,
    },
    contributorName: { type: String },
    contributorEmail: { type: String },
    pullRequestUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false, id: false },
)

export default ContributionSchema
