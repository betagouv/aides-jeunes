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
    contributorEmail: { type: String, required: true },
    body: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      required: true,
      default: "pending",
    },
    githubError: { type: String },
    pullRequestUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false, id: false },
)

export default ContributionSchema
