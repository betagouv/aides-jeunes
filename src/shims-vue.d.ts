declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<
    NonNullable<unknown>,
    NonNullable<unknown>,
    any
  >
  export default component
}
declare module "*.json" {
  const value: unknown
  export default value
}

declare module "generator:institutions" {
  import { RollupInstitutionMap } from "@root/rollup/institutions.js"
  const institutionMap: RollupInstitutionMap
  export default institutionMap
}

declare module "generator:benefits" {
  import { BenefitsMap } from "../data/types/benefits.js"
  const benefitsMap: BenefitsMap
  export default benefitsMap
}
