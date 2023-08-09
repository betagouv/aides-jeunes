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
  import { RollupInstitutionMapInterface } from "@root/rollup/institutions.js"
  const institutionMap: RollupInstitutionMapInterface
  export default institutionMap
}
