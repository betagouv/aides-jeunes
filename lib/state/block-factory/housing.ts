import IndividuMethods from "@lib/individu.js"
import { ChapterName } from "@lib/enums/chapter.js"
import { Activite } from "@lib/enums/activite.js"
import { LogementCategory } from "@lib/enums/logement.js"
import { StepGenerator, ComplexStepGenerator } from "@lib/state/steps.js"
import { generator as datesGenerator } from "@lib/dates.js"

export function housingBlock() {
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
