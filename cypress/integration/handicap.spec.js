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
    foyer.enCouple(false)

    logement.fillLogement("sansDomicile")
    logement.fillCity("94120")

    revenu.fillRevenuType(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    projet.fillDriverLicense(false)

    results.wait()
    results.hasAAH(1)
  })
})
