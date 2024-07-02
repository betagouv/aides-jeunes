import baseContext from "./base.js"
import mesAidesContext from "./mes-aides.js"

const contexts = {
  [baseContext.name]: baseContext,
  [mesAidesContext.name]: mesAidesContext,
}

const context = contexts[process.env.VITE_CONTEXT_NAME]
export default context
