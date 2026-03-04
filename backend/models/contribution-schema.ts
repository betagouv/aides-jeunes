import mongoose from "mongoose"
import type { Contribution } from "../../lib/types/contributions.d.js"
import {
  ContributionPullRequestStatus,
  ContributionCategory,
} from "../../lib/enums/contribution.js"
import { ContributionModel } from "../types/models.d.js"

const ContributionSchema = new mongoose.Schema<Contribution, ContributionModel>(
  {
    type: {
      type: String,
      enum: Object.values(ContributionCategory),
      required: true,
    },
    contributorName: { type: String },
    contributorEmail: { type: String, required: true },
    body: { type: mongoose.Schema.Types.Mixed, required: true },
    pullRequestStatus: {
      type: String,
      enum: Object.values(ContributionPullRequestStatus),
      required: true,
      default: ContributionPullRequestStatus.PENDING,
    },
    githubError: { type: String },
    pullRequestUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false, id: false },
)

export default ContributionSchema
