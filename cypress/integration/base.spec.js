/// <reference types="Cypress" />
import navigate from "../utils/navigate"
import profil from "../utils/profil"
import foyer from "../utils/foyer"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("accepts a basic situation", () => {
    navigate.goHome()

    profil.defaultIndivu()

    foyer.children(0)
    foyer.fill_en_couple(false)

    logement.fill_logement("sansDomicile")
    logement.fill__nombreMoisEntreeLogement(-12)
    logement.fill_depcom("94120")

    revenu.fill_ressources_types([
      "salaire_net",
      "rpns_auto_entrepreneur_CA_bnc",
    ])
    revenu.fillConstantRevenu(1101.42)
    revenu.ignore()

    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)

    results.wait()

    results.hasPrimeActivite()
    results.captureFiscalResources()
  })
})
