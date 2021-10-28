import { submit, fillRadio } from "./form"

const fill_logement = (logement, type) => {
  fillRadio("logement", logement, type)
  if (type) {
    fillRadio("logement", type)
  }
}

const fill_participation_frais = (participe) => {
  fillRadio("participation_frais", participe)
}

const fill_habite_chez_parents = (situation) => {
  fillRadio("habite_chez_parents", situation)
}

const fill_depcom = (department) => {
  cy.url().should("includes", "depcom")
  cy.get("#cp").type(department)
  cy.wait("@communes")
  submit()
}

const fill_coloc = (coloc) => {
  fillRadio("coloc", coloc)
}

const fill_logement_chambre = (singleRoom) => {
  fillRadio("logement_chambre", singleRoom)
}

const fill_proprietaire_proche_famille = (familyLink) => {
  fillRadio("proprietaire_proche_famille", familyLink)
}

const fill_loyer = (loyer, charges) => {
  cy.url().should("includes", "loyer")
  cy.get("#loyer").type(loyer)
  if (charges) {
    cy.get("#charges").type(charges)
  }
  submit()
}

const fill_en_france = (inFrance) => {
  fillRadio("_en_france", inFrance)
}

export default {
  fill_logement,
  fill_depcom,
  fill_coloc,
  fill_logement_chambre,
  fill_proprietaire_proche_famille,
  fill_loyer,
  fill_en_france,
  fill_participation_frais,
  fill_habite_chez_parents,
}
