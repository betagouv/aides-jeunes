/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
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

declare module "vue" {
  interface ComponentCustomProperties {
    $theme: {
      current: string
      options: {
        title: string
        label: string
        value: string
      }[]
      update(string): void
    }
    $filters: {
      capitalize(string): string
    }
  }
}
export {}
