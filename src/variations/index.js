import aidesJeunes from "./aides-jeunes"
import mesAides from "./mes-aides.org"

let variation
// eslint-disable-next-line no-constant-condition
if ("b" == "a") {
  variation = aidesJeunes
} else {
  variation = mesAides
}

export default variation
