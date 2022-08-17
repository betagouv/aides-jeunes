import { DepcomProperty } from "./property.js"

export default {
  _bourseCriteresSociauxCommuneDomicileFamilial: new DepcomProperty({
    question: "Quel est le code postal de la commune de vos parents ?",
  }),
  default: [],
  depcom: new DepcomProperty({
    question: "Quel est votre code postal ?",
  }),
}
