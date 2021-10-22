/// <reference types="Cypress" />
import profil from "../utils/profil"
import navigate from "../utils/navigate"
import logement from "../utils/logement"
import revenu from "../utils/revenu"
import projet from "../utils/projet"
import results from "../utils/results"
import foyer from "../utils/foyer"

context("Full simulation", () => {
  beforeEach(() => {
    navigate.init()
  })

  it("accept a student situation", () => {
    navigate.goHome()

    profil.etudiantPublic()

    foyer.children(0)
    foyer.enCouple(false)
    foyer.fillParentSituation("separes")
    foyer.fillChildrenAtCharge(1)
    foyer.fillChildrenInSuperieur(1)

    logement.fillLogement("heberge")
    logement.fillParticipation(false)
    logement.fillLiveWithParents(true)
    logement.fillCity("45200")

    revenu.fillRevenuType(["salaire_net"])
    revenu.fillConstantRevenu(17860.35)
    revenu.fillRevenuBrut(1)

    projet.fillDriverLicense(false)
    projet.fillStudyOutside(true)
    projet.fillScolarship(false)
    projet.fillStudyAbroad(true, 2)

    results.wait()

    results.hasBourseCriteresSociaux(3)
  })
})
