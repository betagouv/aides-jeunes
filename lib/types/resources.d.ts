// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Situation } from "./situations.js"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Individu } from "./individu.js"

export interface Resource {
  id: string
  label: string
  category: string
  prefix?: string
  isRelevant?(Situation, Individu?): boolean
  interuptionQuestionLabel?: string
  positionInList?: string
  hint?: string
  sourceOpenfisca?: string
  isMontantAnnuel?: boolean
  extra?: {
    id: string
    default: string
    openfiscaPeriod: string
  }[]
}

export interface ResourceCategory {
  id: string
  label: string
}
