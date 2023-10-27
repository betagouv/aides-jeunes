import IndividuMethods from "../individu.js"
import Ressource from "../ressource.js"
import { generator as datesGenerator } from "../dates.js"
import { StepGenerator, ComplexStepGenerator } from "./steps.js"

import { Activite } from "../enums/activite.js"
import { ChapterName } from "../enums/chapter.js"
import { Block } from "../types/blocks.js"
import { individuBlockFactory } from "./block-factory/individu.js"
import { extraBlock } from "./block-factory/extra.js"
import { kidBlock } from "./block-factory/kids.js"

function resourceBlocks(situation) {
  const individuResourceBlock = (individuId) => {
    const individu =
      situation[individuId] ||
      situation.enfants?.find((enfant) => enfant.id === individuId) ||
      {}
    return {
      steps: [
        new ComplexStepGenerator({
          route: `individu/${individuId}/ressources/types`,
          chapter: ChapterName.Revenus,
          entity: "individu",
          variable: "ressources",
          id: individuId,
        }),
      ].concat(
        Ressource.getIndividuRessourceCategories(individu, situation).map(
          (category) =>
            new ComplexStepGenerator({
              route: `individu/${individuId}/ressources/montants/${category}`,
              entity: "individu",
              variable: category,
              id: individuId,
            })
        )
      ),
    }
  }
  return {
    steps: [
      individuResourceBlock("demandeur"),
      ...(situation.conjoint ? [individuResourceBlock("conjoint")] : []),
      ...(situation.enfants?.length
        ? [
            new StepGenerator({
              entity: "individu",
              variable: "_hasRessources",
              id: "enfants",
            }),
          ]
        : []),
      {
        steps: situation.enfants
          ? situation.enfants.map((e) => {
              return e._hasRessources
                ? individuResourceBlock(e.id)
                : { steps: [] }
            })
          : [],
      },
    ],
  }
}

export function generateBlocks(situation): Block[] {
  return [
    individuBlockFactory("demandeur"),
    kidBlock(situation),
    {
      steps: [
        new StepGenerator({ entity: "famille", variable: "en_couple" }),
        {
          isActive: (situation) =>
            situation.enfants?.length && !situation.famille.en_couple,
          steps: [
            new StepGenerator({
              entity: "famille",
              variable: "rsa_isolement_recent",
            }),
          ],
        },
        ...(situation.conjoint ? [individuBlockFactory("conjoint")] : []),
      ],
    },
    {
      subject: (situation) => situation.demandeur,
      isActive: (subject, situation) => {
        const thisYear = datesGenerator(situation.dateDeValeur).thisYear.id
        const enfant_a_charge =
          subject.enfant_a_charge && subject.enfant_a_charge[thisYear]

        return (
          enfant_a_charge ||
          (subject.activite === Activite.Etudiant &&
            !subject.alternant &&
            !situation.enfants?.length)
        )
      },
      steps: [
        new StepGenerator({ entity: "parents", variable: "_situation" }),
        {
          subject: (demandeur, situation) => situation.parents,
          isActive: (parents, situation) => {
            const parents_ok =
              !parents || !IndividuMethods.isWithoutParent(situation)

            const demandeur_ok =
              situation.demandeur.activite === Activite.Etudiant &&
              !situation.demandeur.alternant &&
              !situation.enfants?.length

            return parents_ok && demandeur_ok
          },
          steps: [
            new StepGenerator({
              entity: "famille",
              variable: "bourse_criteres_sociaux_nombre_enfants_a_charge",
            }),
            new StepGenerator({
              entity: "famille",
              variable:
                "bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur",
            }),
          ],
        },
      ],
    },
    housingBlock(),
    resourceBlocks(situation),
    {
      isActive: (situation) => {
        const parents_ok =
          !situation.parents || !IndividuMethods.isWithoutParent(situation)
        return parents_ok
      },
      steps: [
        {
          isActive: (situation) => {
            const demandeur = situation.demandeur
            const demandeur_ok =
              demandeur &&
              demandeur.activite === Activite.Etudiant &&
              !demandeur.alternant &&
              !(situation.enfants && situation.enfants.length)
            return demandeur_ok
          },
          steps: [
            new StepGenerator({
              entity: "individu",
              id: "demandeur",
              variable: "bourse_criteres_sociaux_base_ressources_parentale",
            }),
          ],
        },
        {
          subject: (situation) => situation.demandeur,
          isActive: (demandeur, situation) => {
            const thisYear = datesGenerator(situation.dateDeValeur).thisYear.id
            const enfant_a_charge = demandeur.enfant_a_charge?.[thisYear]

            const demandeur_ok_bcs =
              demandeur &&
              demandeur.activite === Activite.Etudiant &&
              !demandeur.alternant &&
              !situation.enfants?.length
            return enfant_a_charge && !demandeur_ok_bcs
          },
          steps: [
            new StepGenerator({
              entity: "parents",
              variable: "rfr",
            }),
          ],
        },
        {
          subject: (situation) => situation.demandeur,
          isActive: (demandeur, situation) => {
            const thisYear = datesGenerator(situation.dateDeValeur).thisYear.id
            return demandeur.enfant_a_charge?.[thisYear]
          },
          steps: [
            new StepGenerator({
              entity: "parents",
              variable: "nbptr",
            }),
          ],
        },
      ],
    },
    extraBlock(),
    {
      steps: [
        new StepGenerator({
          entity: "resultats",
          chapter: ChapterName.Resultats,
        }),
      ],
    },
  ]
}
