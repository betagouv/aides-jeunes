export interface InstitutionRaw {
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

export interface Institution extends InstitutionRaw {
  label: string
  benefitsIds: string[]
  slug: string
  id: string
}

export interface InstitutionsMap {
  [key: string]: Institution
}
