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

const UPDATE_METHODS = {
  individu: "updateIndividu",
  foyerFiscal: "updateFoyerFiscal",
  parents: "updateParents",
}

const INTERNAL_UPDATE_METHODS = {
  individu: "saveIndividu",
  famille: "saveFamille",
  foyerFiscal: "saveFoyerFiscal",
  menage: "saveMenage",
  parents: "saveParents",
}

Step.prototype.clean = function ({ commit, dispatch, getters }, storeInternal) {
  const subject =
    getters.situation[this.entity] ||
    getters.situation[this.id] ||
    getters.situation.enfants.find((enfant) => enfant.id === this.id)
  const result = { ...subject, [this.variable]: undefined }
  const updateMethod = UPDATE_METHODS[this.entity]
  const internalUpdateMethod = INTERNAL_UPDATE_METHODS[this.entity]
  return storeInternal
    ? commit(internalUpdateMethod, result)
    : dispatch(updateMethod, result)
}

function ComplexStep({ route, variables, chapter }) {
  Step.call(this, { key: route, chapter: chapter })
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
  UPDATE_METHODS,
}
