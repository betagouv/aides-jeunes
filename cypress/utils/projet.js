import { fillRadio, submit } from "./form"

const fill_interetPermisDeConduire = (expect) => {
  fillRadio("_interetPermisDeConduire", expect)
}

const fill_sortie_region_academique = (outside) => {
  fillRadio("sortie_region_academique", outside)
}

const fill_boursier = (scolarship) => {
  fillRadio("boursier", scolarship)
}

const fill_interetEtudesEtranger = (abroad) => {
  fillRadio("_interetEtudesEtranger", abroad)
}

const fill_dureeMoisEtudesEtranger = (duration) => {
  cy.url().should("includes", "_dureeMoisEtudesEtranger")
  cy.get("form").find('input[type="number"]').type(duration)
  submit()
}

export default {
  fill_interetPermisDeConduire,
  fill_sortie_region_academique,
  fill_boursier,
  fill_interetEtudesEtranger,
  fill_dureeMoisEtudesEtranger,
}
