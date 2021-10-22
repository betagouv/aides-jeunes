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

const enCouple = (enCouple) => {
  fillRadio("en_couple", enCouple)
}

const fillParentSituation = (situation) => {
  fillRadio("_situation", situation)
}

const fillChildrenAtCharge = (numberOfChildren) => {
  cy.get(".aj-question > span").invoke("text").should("contain", "la charge")
  cy.get('input[type="number"').type(numberOfChildren)
  submit()
}

const fillChildrenInSuperieur = (numberOfChildren) => {
  cy.get(".aj-question > span")
    .invoke("text")
    .should("contain", "des études supérieures")
  cy.get('input[type="number"').type(numberOfChildren)
  submit()
}

export default {
  enCouple,
  children,
  fillParentSituation,
  fillChildrenAtCharge,
  fillChildrenInSuperieur,
}
