import { submit, fillRadio } from "./form"
import { urlInclude } from "./controllers"

const fill__logementType = (_logementType) => {
  fillRadio("_logementType", _logementType)
}

const fill__locationType = (_locationType) => {
  fillRadio("_locationType", _locationType)
}

const fill__primoAccedant = (_primoAccedant) => {
  fillRadio("_primoAccedant", _primoAccedant)
}

const fill__nombreMoisEntreeLogement = (nombre) => {
  fillRadio("_nombreMoisEntreeLogement", nombre)
}

const fill_participation_frais = (participe) => {
  fillRadio("participation_frais", participe)
}

const fill_habite_chez_parents = (situation) => {
  fillRadio("habite_chez_parents", situation)
}

const fill_depcom = (department, name = "depcom") => {
  urlInclude(name)
  cy.checkA11y()
  cy.get('[data-testid="postalCode"]').type(department)
  cy.wait("@communes")
  submit()
}

const fill_parisien = (parisien) => {
  fillRadio("parisien", parisien)
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
  urlInclude("loyer")
  cy.checkA11y()
  cy.get('input[data-testid="loyer"]').type(loyer)
  if (charges) {
    cy.get('input[data-testid="charges"]').type(charges)
  }
  submit()
}

const fill__en_france = (inFrance) => {
  fillRadio("_en_france", inFrance)
}

export default {
  fill__logementType,
  fill__locationType,
  fill__primoAccedant,
  fill__nombreMoisEntreeLogement,
  fill_depcom,
  fill_parisien,
  fill_coloc,
  fill_logement_chambre,
  fill_proprietaire_proche_famille,
  fill_loyer,
  fill__en_france,
  fill_participation_frais,
  fill_habite_chez_parents,
}
