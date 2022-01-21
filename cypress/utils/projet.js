import { fillRadio, fillCheckboxes, fillNumber } from "./form"

const fill__interetsAidesVelo = (expect) => {
  fillCheckboxes("_interetsAidesVelo", expect)
}

const fill__interetBafa = (expect) => {
  fillRadio("_interetBafa", expect)
}

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
  fillNumber("_dureeMoisEtudesEtranger", duration)
}

export default {
  fill__interetsAidesVelo,
  fill__interetBafa,
  fill__interetPermisDeConduire,
  fill_sortie_region_academique,
  fill_boursier,
  fill__interetEtudesEtranger,
  fill__dureeMoisEtudesEtranger,
}
