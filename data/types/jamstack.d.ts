import { JavascriptBenefitLayout } from "./benefits.d.js"
import { InstitutionRaw } from "./institutions.d.js"

interface NetlifyCollection {
  name: string
  label: string
  label_singular: string
  identifier_field: string
  folder: string
  create: boolean
  delete: boolean
  editor: {
    preview: boolean
  }
  slug: string
  extension: string
  fields: NetlifyField[]
}
interface NetlifyField {
  [key: string]: string
}

interface BenefitsJavascriptCollection extends NetlifyCollection {
  items: JavascriptBenefitLayout[]
}
interface InstitutionCollection extends NetlifyCollection {
  items: InstitutionRaw[]
}

export interface JamstackLayout {
  locale: any
  backend: any
  media_folder: any
  public_folder: any
  slug: any
  publish_mode: any
  root: any
  patterns: any
  fields: any
  collections: {
    benefits_javascript: BenefitsJavascriptCollection
    benefits_openfisca: any
    institutions: InstitutionCollection
    institution_types: any
  }
}
