export interface StepLayout {
  key?: string
  entity?: string
  id?: string
  variable?: string
  chapter?: string
  isActive?: boolean
}

export interface StepGeneratorLayout {
  path: string
  key: string
  entity: string
  id: string
  variable: string
  chapter: string
  isActive?: boolean
}

export interface ComplexStepLayout {
  route?: string
  variables?: StepLayout[]
  chapter?: string
  entity?: string
  variable?: string
  id?: string
  isActive?: boolean
}

export interface ComplexStepGeneratorLayout {
  path: string
  key: string
  entity: string
  id: string
  variable: string
  chapter: string
  substeps: StepLayout[]
  isActive?: boolean
}
