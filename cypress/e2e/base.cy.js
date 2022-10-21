/// <reference types="Cypress" />
import navigate from "../utils/navigate"
import profil from "../utils/profil"
import foyer from "../utils/foyer"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"

const basic_situation_first_step = () => {
  navigate.goHome()
  profil.defaultIndivu()
  foyer.children(0)
  foyer.fill_en_couple(false)
}

const basic_situation_second_step = () => {
  logement.fill_logement("sansDomicile")
  logement.fill__nombreMoisEntreeLogement(-12)
  logement.fill_depcom("94120")
  revenu.fill_ressources_types([
    "salaire_net",
    "rpns_micro_entreprise_CA_bnc_imp",
  ])
  revenu.fillConstantRevenu(1101.42)
  revenu.ignore()
}

const basic_situation_third_step = () => {
  projet.fill__interetsAidesVelo([])
  projet.fill__interetBafa(false)
  projet.fill__interetPermisDeConduire(false)
  projet.fill__interetAidesSanitaireSocial(false)
  results.wait()
  results.hasPrimeActivite()
  results.captureFiscalResources()
}

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("Accepts a basic situation", () => {
    basic_situation_first_step()
    basic_situation_second_step()
    basic_situation_third_step()
  })

  it("Go to the recap during a basic situation and continue the simulation without modification", () => {
    basic_situation_first_step()
    navigate.goRecap()
    navigate.next()
    basic_situation_second_step()
    basic_situation_third_step()
  })

  it("Go to the recap during a basic situation and modify the simulation", () => {
    basic_situation_first_step()
    navigate.goRecap()
    navigate.updateFromRecap("Mes enfants à charge")
    foyer.children(1)
    foyer.fill_en_couple(false)
    foyer.fill_rsa_isolement_recent(false)
    basic_situation_second_step()
    revenu.fillChildrenRessources([true])
    revenu.fill_ressources_types([])
    basic_situation_third_step()
  })
})
