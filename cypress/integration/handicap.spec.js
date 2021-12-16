/// <reference types="Cypress" />
import profil from "../utils/profil"
import navigate from "../utils/navigate"
import foyer from "../utils/foyer"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("accepts a situation with handicap", () => {
    navigate.goHome()

    profil.handicaped()

    foyer.children(0)
    foyer.fill_en_couple(false)

    logement.fill_logement("sansDomicile")
    logement.fill__nombreMoisEntreeLogement(-12)
    logement.fill_depcom("94120")

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)

    results.wait()
    results.hasAAH()
  })
})
