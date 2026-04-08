import express from "express"
import { rateLimit } from "express-rate-limit"
import {
  handleBenefitContribution,
  handleInstitutionContribution,
} from "../controllers/contributions.js"

const router = express.Router()
router.use(express.json({ limit: "512kb" }))

const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de requêtes. Veuillez réessayer plus tard." },
})

router.post("/benefit", postLimiter, handleBenefitContribution)
router.post("/institution", postLimiter, handleInstitutionContribution)

export default function contributionsRoutes(app: express.Application) {
  app.use("/contributions", router)
}
