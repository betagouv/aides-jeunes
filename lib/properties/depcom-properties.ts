import { DepcomProperty } from "./property.js"

export default {
  depcom: new DepcomProperty({
    question: "Quel est votre code postal ?",
  }),
  _bourseCriteresSociauxCommuneDomicileFamilial: new DepcomProperty({
    question: "Quel est le code postal de la commune de vos parents ?",
  }),
}
