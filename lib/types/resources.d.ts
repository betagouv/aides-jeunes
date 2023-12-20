import { Situation } from "./situations.js"
import { Individu } from "./individu.js"

export interface Resource {
  id: string
  label: string
  category: string
  prefix?: string
  isRelevant?: (situation: Situation, individu: Individu) => boolean
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
