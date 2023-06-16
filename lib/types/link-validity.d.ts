export interface benefitLink {
  link: string
  type: string
  status?: number
  ok?: boolean
}

export interface benefitData {
  id: string
  label: string
  institution: string
  priority: number
  links: benefitLink[]
  editLink: string
  errors: benefitLink[]
}
