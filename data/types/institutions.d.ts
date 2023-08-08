export interface InstitutionLayout {
  slug: string
  id: string
  code_siren: string
  code_insee?: string
  label: string
  imgSrc: string
  departments?: string
  benefitsIds: string[]
  type: string
  top?: number
  repository?: string
  lieuxTypes: string[]
}
