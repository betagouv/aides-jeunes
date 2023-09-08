import { BenefitExtra } from "@data/types/benefits.js"

export interface Conditions {
  [key: string]: {
    test: (...params: any) => boolean
    extra?: BenefitExtra[]
  }
}
