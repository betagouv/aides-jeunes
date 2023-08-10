import express from "express"
import { followup, resultRedirect } from "./controllers/followups.js"

// Setup Express
const app = express()
const router = express.Router()

router.param("followupId", followup as any)
router.get("/:followupId", resultRedirect as any)
app.use(router)

export default app
