import express from "express"
import { followup, resultRedirect } from "./controllers/followups.js"

// Setup Express
const app = express()
const router = express.Router()

router.param("followupId", followup)
router.get("/:followupId", resultRedirect)
app.use(router)

export default app
