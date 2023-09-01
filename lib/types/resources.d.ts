// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { situationsLayout } from "./situations.js"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IndividuProperties } from "./individu.js"

export interface Resource {
  id: string
  label: string
  category: string
  prefix?: string
  isRelevant?(situationsLayout, IndividuProperties?): boolean
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
