function Step({ key, entity, id, variable, chapter }) {
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

const ENTITIES_PROPERTIES = {
  famille: require("@/lib/FamilleProperties").default,
  individu: require("@/lib/IndividuProperties").default,
  menage: require("@/lib/MenageProperties").default,
  parents: require("@/lib/ParentsProperties").default,
}

function ComplexStep({ route, variables, chapter, entity, variable, id }) {
  Step.call(this, { key: route, chapter: chapter, entity, variable, id })
  this.path = `/simulation/${route}`
  this.substeps = variables ? variables.map((v) => new Step(v)) : []
}

ComplexStep.prototype = Object.create(Step.prototype)
ComplexStep.prototype.clean = function (store) {
  this.substeps.forEach((s) => s.clean(store))
}

module.exports = {
  ENTITIES_PROPERTIES,
  ComplexStep,
  Step,
}
