export interface InstitutionRawLayout {
  name: string
  imgSrc: string
  code_siren?: string
  code_insee?: string
  type: string
  prefix?: string
  lieuxTypes?: string[]
  departments?: string
  repository?: string
  top?: number
  //
  slug: string
}

export interface InstitutionLayout extends InstitutionRawLayout {
  label: string
  benefitsIds: string[]
  slug: string
  id: string
}

export interface InstitutionsMap {
  [key as string]: InstitutionLayout
}
