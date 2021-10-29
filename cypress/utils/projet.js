import { fillRadio, submit } from "./form"

const fill__interetPermisDeConduire = (expect) => {
  fillRadio("_interetPermisDeConduire", expect)
}

const fill_sortie_region_academique = (outside) => {
  fillRadio("sortie_region_academique", outside)
}

const fill_boursier = (scolarship) => {
  fillRadio("boursier", scolarship)
}

const fill__interetEtudesEtranger = (abroad) => {
  fillRadio("_interetEtudesEtranger", abroad)
}

const fill__dureeMoisEtudesEtranger = (duration) => {
  cy.url().should("includes", "_dureeMoisEtudesEtranger")
  cy.get("form").find('input[type="number"]').type(duration)
  submit()
}

export default {
  fill__interetPermisDeConduire,
  fill_sortie_region_academique,
  fill_boursier,
  fill__interetEtudesEtranger,
  fill__dureeMoisEtudesEtranger,
}
