import unJeune1solution from "./1jeune1solution"
import mesAides from "./mes-aides.org"

let variation
if (process.env.VUE_APP_VARIATION === "1jeune1solution") {
  variation = unJeune1solution
} else {
  variation = mesAides
}

export default variation
