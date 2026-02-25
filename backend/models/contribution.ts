import mongoose from "mongoose"
import type { Contribution } from "../../lib/types/contributions.d.js"
import { ContributionModel } from "../types/models.d.js"
import ContributionSchema from "./contribution-schema.js"

export default mongoose.model<Contribution, ContributionModel>(
  "Contribution",
  ContributionSchema,
)
