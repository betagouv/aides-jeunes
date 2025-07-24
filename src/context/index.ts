import baseContext from "./base.js"
import mesAidesContext from "./mes-aides.js"
import mesAidesOrgContext from "./mes-aides-org.js"

const contexts = {
  [baseContext.name]: baseContext,
  [mesAidesContext.name]: mesAidesContext,
  [mesAidesOrgContext.name]: mesAidesOrgContext,
}

const context = contexts[process.env.VITE_CONTEXT_NAME]
export default context
