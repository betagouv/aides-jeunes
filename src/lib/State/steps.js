function Step({key, entity, id, variable}) {
  this.fullPath = entity ? `/simulation/${entity}${id ? `/${id}` : ''}${variable ? `/${variable}` : ''}` : '/'
  this.key = key || this.fullPath
  this.entity = entity
  this.id = id
  this.variable = variable
}

const updateMethods = {
  individu: 'updateIndividu',
  famille: 'updateFamille',
  foyerFiscal: 'updateFoyerFiscal',
  menage: 'updateMenage',
}

const internalUpdateMethods = {
  individu: 'saveIndividu',
  famille: 'saveFamille',
  foyerFiscal: 'saveFoyerFiscal',
  menage: 'saveMenage',
}

Step.prototype.clean = function({commit, dispatch, state}, storeInternal) {
  const subject = state.situation[this.entity] || state.situation[this.id] || state.situation.enfants.find(enfant => enfant.id === this.id)
  const result = {...subject, [this.variable]: undefined}
  const updateMethod = updateMethods[this.entity]
  const internalUpdateMethod = internalUpdateMethods[this.entity]
  return storeInternal ? commit(internalUpdateMethod, result) : dispatch(updateMethod, result)
}

function ComplexStep({route, variables}) {
  Step.call(this, {key: route})
  this.fullPath = `/simulation/${route}`

  this.substeps = variables ? variables.map(v => new Step(v)) : []
}

ComplexStep.prototype = Object.create(Step.prototype)
ComplexStep.prototype.clean = function(store) {
  this.substeps.forEach(s => s.clean(store))
}

module.exports = {
  ComplexStep,
  Step
}
