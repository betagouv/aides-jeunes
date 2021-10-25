import aidesJeunes from "./aides-jeunes"
import demo from "./demo"

let variation
if (process.env.VUE_APP_VARIATION === "demo") {
  variation = demo
} else {
  variation = aidesJeunes
}

export default variation
