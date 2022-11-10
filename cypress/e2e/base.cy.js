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

  it("Go to the recap during a basic situation and modify/continue the simulation", () => {
    navigate.goHome()
    profil.defaultIndivu()
    foyer.children(0)
    foyer.fill_en_couple(false)
    navigate.goRecap()
    navigate.updateFromRecap("Mes enfants à charge")
    foyer.children(1)
    foyer.fill_en_couple(false)
    foyer.fill_rsa_isolement_recent(false)
    navigate.goRecap()
    navigate.next()
    logement.fill_logement("sansDomicile")
    logement.fill_depcom("94120")
    logement.fill__nombreMoisEntreeLogement(-12)
    revenu.fill_ressources_types([
      "salaire_net",
      "rpns_micro_entreprise_CA_bnc_imp",
    ])
    revenu.fillConstantRevenu(1101.42)
    revenu.ignore()
    revenu.fillChildrenRessources([true])
    revenu.fill_ressources_types([])
    projet.fill__interetsAidesVelo([])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetAidesSanitaireSocial(false)
    results.wait()
    results.hasPrimeActivite()
    results.captureFiscalResources()
  })
})
