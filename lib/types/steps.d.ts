export interface StepLayout {
  path?: string
  key?: string
  entity?: string
  id?: string
  variable?: string
  chapter?: string
  isActive?: boolean
}

export interface ComplexStepLayout extends StepLayout {
  route?: string
  variables?: StepLayout[]
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
