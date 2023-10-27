import IndividuMethods from "../individu.js"
import Ressource from "../ressource.js"
import { generator as datesGenerator } from "../dates.js"
import { StepGenerator, ComplexStepGenerator } from "./steps.js"
import { childStepsComplete } from "../enfants.js"

import { Activite } from "../enums/activite.js"
import { LogementCategory } from "../enums/logement.js"
import { ChapterName } from "../enums/chapter.js"
import { Block } from "../types/blocks.js"
import { individuBlockFactory } from "./block-factory/individu.js"
import { extraBlock } from "./block-factory/extra.js"

function kidBlock(situation) {
  return {
    steps: [
      ...(!childStepsComplete(situation)
        ? [new StepGenerator({ entity: "enfants", chapter: ChapterName.Foyer })]
        : []),
      ...(situation.enfants?.length
        ? situation.enfants.map((e) => {
            return {
              steps: [individuBlockFactory(e.id, ChapterName.Foyer)],
            }
          })
        : []),
      ...(childStepsComplete(situation)
        ? [new StepGenerator({ entity: "enfants", chapter: ChapterName.Foyer })]
        : []),
    ],
  }
}

function housingBlock() {
  return {
    subject: (situation) => situation.menage,
    steps: [
      new StepGenerator({
        entity: "menage",
        chapter: ChapterName.Logement,
        variable: "_logementType",
      }),
      {
        isActive: (subject) =>
          subject._logementType === LogementCategory.Proprietaire,
        steps: [
          new StepGenerator({ entity: "menage", variable: "_primoAccedant" }),
        ],
      },
      {
        isActive: (subject) =>
          !subject._logementType ||
          subject._logementType === LogementCategory.Locataire,
        steps: [
          new StepGenerator({ entity: "menage", variable: "_locationType" }),
          new StepGenerator({ entity: "menage", variable: "coloc" }),
          new StepGenerator({ entity: "menage", variable: "logement_chambre" }),
          new StepGenerator({
            entity: "famille",
            variable: "proprietaire_proche_famille",
          }),
        ],
      },
      {
        isActive: (subject) => {
          const locataire =
            !subject._logementType ||
            subject._logementType === LogementCategory.Locataire
          const proprietaire =
            subject._logementType === LogementCategory.Proprietaire
          return locataire || proprietaire
        },
        steps: [
          new ComplexStepGenerator({
            route: "menage/loyer",
            entity: "menage",
            variable: "loyer",
            variables: [
              { entity: "menage", variable: "loyer" },
              { entity: "menage", variable: "charges_locatives" },
            ],
          }),
        ],
      },
      {
        isActive: (subject) =>
          subject._logementType === LogementCategory.Heberge,
        steps: [
          new StepGenerator({
            entity: "menage",
            variable: "participation_frais",
          }),
          new StepGenerator({
            entity: "individu",
            id: "demandeur",
            variable: "habite_chez_parents",
          }),
        ],
      },
      new StepGenerator({ entity: "menage", variable: "depcom" }),
      {
        isActive: (_subject, situation) => {
          const age = IndividuMethods.age(
            situation.demandeur,
            datesGenerator(situation.dateDeValeur).today.value
          )
          const proprietaire =
            situation.menage.statut_occupation_logement ===
            LogementCategory.Proprietaire
          return age >= 18 && !proprietaire
        },
        steps: [
          new StepGenerator({
            entity: "menage",
            variable: "_difficultes_acces_ou_frais_logement",
          }),
        ],
      },
      {
        isActive: (subject) =>
          subject.depcom?.startsWith("75") &&
          subject._logementType !== LogementCategory.SansDomicile,
        steps: [new StepGenerator({ entity: "famille", variable: "parisien" })],
      },
      {
        subject: (menage, situation) => situation.demandeur,
        isActive: (demandeur, situation) => {
          return (
            demandeur.activite === Activite.Etudiant &&
            !demandeur.habite_chez_parents &&
            (!situation.parents || !IndividuMethods.isWithoutParent(situation))
          )
        },
        steps: [
          new StepGenerator({ entity: "parents", variable: "_en_france" }),
          {
            subject: (menage, situation) => situation.parents,
            isActive: (parents) => !parents || parents._en_france,
            steps: [
              new StepGenerator({
                entity: "individu",
                id: "demandeur",
                variable: "_bourseCriteresSociauxCommuneDomicileFamilial",
              }),
            ],
          },
        ],
      },
      {
        isActive: (subject) =>
          [
            LogementCategory.Locataire,
            LogementCategory.SansDomicile,
            LogementCategory.Heberge,
          ].includes(subject._logementType),
        steps: [
          new StepGenerator({
            entity: "menage",
            variable: "_nombreMoisEntreeLogement",
          }),
        ],
      },
    ],
  }
}

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
