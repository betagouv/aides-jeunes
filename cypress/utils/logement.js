import { submit, fillRadio } from "./form"

const fillLogement = (logement, type) => {
  fillRadio("logement", logement, type)
  if (type) {
    fillRadio("logement", type)
  }
}

const fillParticipation = (participe) => {
  fillRadio("participation_frais", participe)
}

const fillLiveWithParents = (situation) => {
  fillRadio("habite_chez_parents", situation)
}

const fillCity = (department) => {
  cy.url().should("includes", "depcom")
  cy.get("#cp").type(department)
  cy.wait("@communes")
  submit()
}

const fillColoc = (coloc) => {
  fillRadio("coloc", coloc)
}

const fillSingleRoom = (singleRoom) => {
  fillRadio("logement_chambre", singleRoom)
}

const fillFamilyLink = (familyLink) => {
  fillRadio("proprietaire_proche_famille", familyLink)
}

const fillLoyer = (loyer, charges) => {
  cy.url().should("includes", "loyer")
  cy.get("#loyer").type(loyer)
  if (charges) {
    cy.get("#charges").type(charges)
  }
  submit()
}

const fillParentInFrance = (inFrance) => {
  fillRadio("_en_france", inFrance)
}

export default {
  fillLogement,
  fillCity,
  fillColoc,
  fillSingleRoom,
  fillFamilyLink,
  fillLoyer,
  fillParentInFrance,
  fillParticipation,
  fillLiveWithParents,
}
