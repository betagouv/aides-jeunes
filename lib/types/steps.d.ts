export interface Step {
  path?: string
  key?: string
  entity?: string
  id?: string
  variable?: string
  chapter?: string
  isActive?: boolean
}

export interface StepStrict extends Step {
  entity: string
  id: string
  variable: string
  path: string
  key: string
}

export interface ComplexStep extends Step {
  route?: string
  variables?: Step[]
}

export interface ComplexStepProperties {
  path: string
  key: string
  entity: string
  id: string
  variable: string
  chapter: string
  substeps: Step[]
  isActive?: boolean
}
