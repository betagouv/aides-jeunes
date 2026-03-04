import mongoose from "mongoose"
import type { Contribution } from "../../lib/types/contributions.d.js"
import ContributionSchema from "./contribution-schema.js"

export default mongoose.model<Contribution>("Contribution", ContributionSchema)
