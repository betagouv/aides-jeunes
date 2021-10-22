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
    foyer.enCouple(true)
    profil.defaultConjoint()

    logement.fillLogement("sansDomicile")
    logement.fillCity("94120")

    revenu.fillRevenuType(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    revenu.fillRevenuType([])
    revenu.fillChildrenRessources([true, false])
    revenu.fillRevenuType(["salaire_net"])
    revenu.fillInconstantRevenu([
      { index: 0, value: 400 },
      { index: 2, value: "{selectall}0" },
    ])

    projet.fillDriverLicense(false)

    results.wait()
    results.hasCSS(2)
    results.hasPrimeActivite(3)
  })
})
