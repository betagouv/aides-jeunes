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
    foyer.enCouple(false)

    logement.fillLogement("sansDomicile")
    logement.fillCity("94120")

    revenu.fillRevenuType(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)

    projet.fillDriverLicense(false)

    results.wait()

    results.hasPrimeActivite(1)
    results.captureFiscalResources(2)
  })

  it("accept a student situation", () => {
    navigate.goHome()

    profil.etudiantPublic()

    foyer.children(0)
    foyer.enCouple(false)
    foyer.fillParentSituation("separes")
    foyer.fillChildrenAtCharge(1)
    foyer.fillChildrenInSuperieur(1)

    logement.fillLogement("locataire", "nonmeuble")
    logement.fillColoc(false)
    logement.fillSingleRoom(false)
    logement.fillFamilyLink(false)
    logement.fillLoyer(600, 100)
    logement.fillCity("94120")
    logement.fillParentInFrance(false)

    revenu.fillRevenuType(["salaire_net"])
    revenu.fillConstantRevenu(1101.42)
    revenu.fillRevenuBrut(0)

    projet.fillDriverLicense(false)
    projet.fillStudyOutside(true)
    projet.fillScolarship(false)
    projet.fillStudyAbroad(true, 2)

    results.wait()
    results.hasAideLogement(3)
  })
})
