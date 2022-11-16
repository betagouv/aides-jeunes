/// <reference types="Cypress" />

import foyer from "../utils/foyer"
import logement from "../utils/logement"
import navigate from "../utils/navigate"
import profil from "../utils/profil"
import projet from "../utils/projet"
import results from "../utils/results"
import revenu from "../utils/revenu"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("accepts a family situation", () => {
    navigate.goHome()

    profil.defaultIndivu()

    foyer.children(2)
    foyer.fill_en_couple(true)
    profil.defaultConjoint()

    logement.fill__logementType("sansDomicile")
    logement.fill_depcom("94120")
    logement.fill__nombreMoisEntreeLogement(-12)

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    revenu.fill_ressources_types([])
    revenu.fillChildrenRessources([true, false])
    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillInconstantRevenu([
      { index: 0, value: 400 },
      { index: 2, value: "{selectall}0" },
    ])

    projet.fill__interetsAidesVelo([])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetAidesSanitaireSocial(false)

    results.wait()
    results.hasCSS()
    results.hasPrimeActivite()
  })
})
