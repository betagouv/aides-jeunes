import { fillRadio, submit } from "./form"
import profil from "./profil"

const children = (numberOfChildren) => {
  for (var i = 0; i < numberOfChildren; i++) {
    cy.url().should("includes", "enfants")
    cy.get("button#add-pac").click()
    profil.defaultChildren()
  }
  cy.url().should("includes", "enfants")
  submit()
}

const fill_en_couple = (enCouple) => {
  fillRadio("en_couple", enCouple)
}

const fill_situation = (situation) => {
  fillRadio("_situation", situation)
}

const fill_bourse_criteres_sociaux_nombre_enfants_a_charge = (
  numberOfChildren
) => {
  cy.get(".aj-question > span").invoke("text").should("contain", "la charge")
  cy.get('input[type="number"').type(numberOfChildren)
  submit()
}

const fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur =
  (numberOfChildren) => {
    cy.get(".aj-question > span")
      .invoke("text")
      .should("contain", "des études supérieures")
    cy.get('input[type="number"').type(numberOfChildren)
    submit()
  }

export default {
  children,
  fill_en_couple,
  fill_situation,
  fill_bourse_criteres_sociaux_nombre_enfants_a_charge,
  fill_bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur,
}
