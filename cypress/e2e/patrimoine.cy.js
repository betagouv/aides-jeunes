/// <reference types="Cypress" />
import profil from "../utils/profil"
import navigate from "../utils/navigate"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"
import foyer from "../utils/foyer"
import form from "../utils/form"
import "cypress-axe"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
    cy.injectAxe()
  })

  it("accept a basic situation", () => {
    navigate.goHome()

    profil.defaultIndivu()

    foyer.children(0)
    foyer.fill_en_couple(false)

    logement.fill__logementType("locataire")
    logement.fill__locationType("vide")
    logement.fill_coloc(false)
    logement.fill_logement_chambre(false)
    logement.fill_proprietaire_proche_famille(false)
    logement.fill_loyer(600, 100)
    logement.fill_depcom("34000")
    logement.fill__nombreMoisEntreeLogement(-2)

    revenu.fill_ressources_types(["salaire_net"])
    revenu.fillConstantRevenu(400)

    projet.fill__interetsAidesVelo(["velo_mecanique"])
    projet.fill__interetBafa(false)
    projet.fill__interetPermisDeConduire(false)
    projet.fill__interetAidesSanitaireSocial(false)

    results.wait()
    results.hasAideVeloNationale()
    results.hasHousingBenefit()
    results.back()
    results.hasRSA()
    form.fillPatrimoine()
    results.wait()
    results.hasNotBenefit("rsa")
  })
})
