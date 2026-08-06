export function AidesJeunesPreremplissage(simulation) {
  this.simulation = simulation
}

AidesJeunesPreremplissage.prototype.toInternal = function () {
  return {}
}

AidesJeunesPreremplissage.prototype.toExternal = function () {
  try {
    // Calcul mené pour un tiers sur un document que l'appelant a pu modifier en
    // mémoire : il reste hors du cache de l'usager.
    const p = this.simulation
      .compute({ cache: false })
      .then((results) => {
        return results
      })
      .catch((err) => {
        return { err: err.toString() }
      })
    return p
  } catch (e) {
    console.log(e)
  }
}
