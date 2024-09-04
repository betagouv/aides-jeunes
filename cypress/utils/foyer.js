import { fillRadio, submit } from "./form.js"
import profil from "./profil.js"
import { urlInclude } from "./controllers.js"

const children = (numberOfChildren, totalToCheck = numberOfChildren) => {
  for (let i = 0; i < numberOfChildren; i++) {
    urlInclude("enfants")
    cy.checkA11y()
    cy.get('[data-testid="add-pac"]').click()
    profil.defaultChildren()
  }
  checkChildrenNumber(totalToCheck)
  urlInclude("enfants")
  submit()
}

const kindergartenChildren = () => {
  urlInclude("enfants")
  cy.checkA11y()
  cy.get('[data-testid="add-pac"]').click()
  profil.kindergartenChildren()
  urlInclude("enfants")
}

const deleteChildren = (index) => {
  cy.get(`[data-testid="row-enfant_${index}"]`).should("be.visible")
  cy.get(`[data-testid="delete-enfant_${index}"]`).click()
  cy.get(`[data-testid="row-enfant_${index}"]`).should("not.exist")
}

const checkChildrenNumber = (numberOfChildren) => {
  for (let i = 0; i < numberOfChildren; i++) {
    cy.get(`[data-testid="row-enfant_${i}"]`).should("be.visible")
  }
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
  kindergartenChildren,
  deleteChildren,
  checkChildrenNumber,
  fill_en_couple,
  fill__situation,
  fill_bourse_criteres_sociaux_nombre_enfants_a_charge,
  fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur,
  fill_rsa_isolement_recent,
}
