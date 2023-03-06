import { fillRadio, submit } from "./form"
import profil from "./profil"
import { urlInclude } from "./controllers"

const children = (numberOfChildren) => {
  for (let i = 0; i < numberOfChildren; i++) {
    urlInclude("enfants")
    cy.checkA11y()
    cy.get('[data-testid="add-pac"]').click()
    profil.defaultChildren()
  }
  urlInclude("enfants")
  submit()
}

const fill_en_couple = (enCouple) => {
  fillRadio("en_couple", enCouple)
}

const fill__situation = (situation) => {
  fillRadio("_situation", situation)
}

const fill_bourse_criteres_sociaux_nombre_enfants_a_charge = (
  numberOfChildren
) => {
  cy.checkA11y()
  cy.get('[data-testid="question"')
    .invoke("text")
    .should("contain", "la charge")
  cy.get(
    'input[type="text"][data-testid="bourse_criteres_sociaux_nombre_enfants_a_charge"]'
  ).type(numberOfChildren)
  submit()
}

const fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur =
  (numberOfChildren) => {
    cy.checkA11y()
    cy.get("[data-testid='question']")
      .invoke("text")
      .should("contain", "des études supérieures")
    cy.get(
      'input[type="text"][data-testid="bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur"]'
    ).type(numberOfChildren)
    submit()
  }

const fill_rsa_isolement_recent = (isolement) => {
  fillRadio("rsa_isolement_recent", isolement)
}

export default {
  children,
  fill_en_couple,
  fill__situation,
  fill_bourse_criteres_sociaux_nombre_enfants_a_charge,
  fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur,
  fill_rsa_isolement_recent,
}
