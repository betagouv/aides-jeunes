import { ChapterName } from "@lib/enums/chapter.js"
import { StepGenerator } from "@lib/state/steps.js"
import { Scolarite, Etudiant } from "@lib/enums/scolarite.js"
import { Activite } from "@lib/enums/activite.js"
import ScolariteCategories from "@lib/scolarite.js"

export function extraBlock() {
  const id = "demandeur"
  const s = (variable: string, chapter?: string) =>
    new StepGenerator({ entity: "individu", id, variable, chapter })

  return {
    subject: (situation) =>
      situation[id] ||
      situation.enfants?.find((enfant) => enfant.id === id) ||
      {},
    steps: [
      s("_interetsAidesVelo", ChapterName.Projets),
      s("_interetBafa", ChapterName.Projets),
      s("_interetPermisDeConduire", ChapterName.Projets),
      {
        isActive: (subject) => {
          return (
            subject.groupe_specialites_formation !==
            ScolariteCategories.groupeSpecialitesFormation
              .specialites_plurivalentes_sanitaires_et_sociales.value
          )
        },
        steps: [s("_interetAidesSanitaireSocial", ChapterName.Projets)],
      },
      {
        isActive: (subject) => subject.annee_etude === Etudiant.Terminale,
        steps: [
          s("sortie_academie"),
          {
            isActive: (subject) => {
              return (
                subject.sortie_academie &&
                typeof subject.bourse_lycee !== "object"
              )
            },
            steps: [
              new StepGenerator({
                entity: "famille",
                variable: "bourse_lycee",
              }),
            ],
          },
        ],
      },
      {
        isActive: (subject) =>
          [Etudiant.Licence3, Etudiant.Master1].includes(subject.annee_etude),
        steps: [
          s("sortie_region_academique"),
          {
            isActive: (subject) => subject.sortie_region_academique,
            steps: [s("boursier")],
          },
        ],
      },
      {
        isActive: (subject) =>
          (subject.scolarite === Scolarite.EnseignementSuperieur &&
            ["public", "prive_sous_contrat"].includes(
              subject.statuts_etablissement_scolaire
            )) ||
          subject._contrat_alternant === Activite.Apprenti,
        steps: [
          s("_interetEtudesEtranger"),
          {
            isActive: (subject) => subject._interetEtudesEtranger,
            steps: [s("_dureeMoisEtudesEtranger")],
          },
        ],
      },
    ],
  }
}
