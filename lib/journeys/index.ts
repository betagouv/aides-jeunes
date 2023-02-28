import { Step } from "../state/steps.js"

export const journeys = {
  default: {},
  bourse_criteres_sociaux: {
    benefitIds: ["bourse_criteres_sociaux"],
    assumptions: [
      {
        fieldName: "bourse_criteres_sociaux_eligibilite_etude",
        entityName: "individu",
        id: "demandeur",
        value: true,
      },
    ],
    steps: [
      { steps: [new Step({})] },
      new Step({
        entity: "individu",
        id: "demandeur",
        variable: "date_naissance",
        chapter: "profil",
      }),
      new Step({ entity: "menage", variable: "depcom" }),
      new Step({
        entity: "individu",
        id: "demandeur",
        variable: "_bourseCriteresSociauxCommuneDomicileFamilial",
      }),
      new Step({
        entity: "famille",
        variable: "bourse_criteres_sociaux_nombre_enfants_a_charge",
      }),
      new Step({
        entity: "famille",
        variable:
          "bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur",
      }),
      new Step({
        entity: "individu",
        id: "demandeur",
        variable: "bourse_criteres_sociaux_base_ressources_parentale",
      }),
      new Step({ entity: "resultats", chapter: "resultats" }),
      new Step({ entity: "resultats", chapter: "resultats" }),
    ],
  },
}
