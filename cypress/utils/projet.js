import { fillRadio, submit } from "./form"

const fillDriverLicense = (expect) => {
  fillRadio("_interetPermisDeConduire", expect)
}

const fillStudyOutside = (outside) => {
  fillRadio("sortie_region_academique", outside)
}

const fillScolarship = (scolarship) => {
  fillRadio("boursier", scolarship)
}

const fillStudyAbroad = (abroad, duration) => {
  fillRadio("_interetEtudesEtranger", abroad)
  cy.url().should("includes", "_dureeMoisEtudesEtranger")
  cy.get("form").find('input[type="number"]').type(duration)
  submit()
}
export default {
  fillDriverLicense,
  fillStudyOutside,
  fillScolarship,
  fillStudyAbroad,
}
