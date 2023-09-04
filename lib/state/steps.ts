import {
  StepLayout,
  ComplexStepLayout,
  ComplexStepGeneratorLayout,
} from "../types/steps.js"

function StepGenerator(
  this: StepLayout,
  { key, entity, id, variable, chapter }: StepLayout
) {
  this.path = entity
    ? `/simulation/${entity}${id ? `/${id}` : ""}${
        variable ? `/${variable}` : ""
      }`
    : "/"
  this.key = key || this.path
  this.entity = entity
  this.id = id
  this.variable = variable
  this.chapter = chapter
}

function ComplexStepGenerator(
  this: ComplexStepGeneratorLayout,
  { route, variables, chapter, entity, variable, id }: ComplexStepLayout
) {
  StepGenerator.call(this, {
    key: route,
    chapter: chapter,
    entity,
    variable,
    id,
  })
  this.path = `/simulation/${route}`
  this.substeps = variables ? variables.map((v) => new StepGenerator(v)) : []
}

ComplexStepGenerator.prototype = Object.create(StepGenerator.prototype)
ComplexStepGenerator.prototype.clean = function (store) {
  this.substeps.forEach((s) => s.clean(store))
}

export { ComplexStepGenerator, StepGenerator }
