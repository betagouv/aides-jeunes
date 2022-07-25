export interface StepLayout {
  key?: string
  entity?: any
  id?: any
  variable?: any
  chapter?: any
  isActive?: boolean
}

export interface StepGeneratorLayout {
  path: string
  key: string
  entity: any
  id: string
  variable: any
  chapter: any
  isActive?: boolean
}

export interface ComplexStepLayout {
  route?: any
  variables?: any
  chapter?: any
  entity?: any
  variable?: any
  id?: any
  isActive?: boolean
}

export interface ComplexStepGeneratorLayout {
  path: string
  key: string
  entity: any
  id: string
  variable: any
  chapter: any
  substeps: any
}
