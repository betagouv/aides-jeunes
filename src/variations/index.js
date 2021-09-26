import aidesJeunes from "./aides-jeunes"
import mesAides from "./mes-aides.org"

let variation
if (process.env.VUE_APP_VARIATION !== "mes-aides.org") {
  variation = aidesJeunes
} else {
  variation = mesAides
}

export default variation
