import { ChapterName } from "@lib/enums/chapter.js"
import { StepGenerator } from "@lib/state/steps.js"
import { Scolarite, Etudiant } from "@lib/enums/scolarite.js"
import { Activite } from "@lib/enums/activite.js"
import IndividuMethods from "@lib/individu.js"
import { ACTIVITES_ACTIF } from "@lib/activite.js"
import { generator as datesGenerator } from "@lib/dates.js"

export function individuBlockFactory(id, chapter?: ChapterName) {
  const r = (variable, chapter?: ChapterName) => {
    return new StepGenerator({
      entity: "individu",
      id,
      variable,
      chapter,
    })
  }

  const conjoint = id == "conjoint"
  const demandeur = id == "demandeur"
  const enfant = id.startsWith("enfant")
  return {
    subject: (situation) =>
      situation[id] ||
      situation.enfants?.find((enfant) => enfant.id === id) ||
      {},
    steps: [
      ...(enfant ? [r("_firstName", chapter)] : []),
      r("date_naissance", demandeur ? ChapterName.Profil : chapter),
      r("nationalite"),
      ...(conjoint ? [r("statut_marital")] : []),
      ...(enfant ? [r("garde_alternee")] : []),
      ...(!enfant ? [r("activite")] : []),
      ...(demandeur
        ? [
            {
              isActive: (subject) => subject.activite == Activite.Etudiant,
              steps: [
                r("scolarite"),
                {
                  isActive: (subject) =>
                    [Scolarite.Lycee, Scolarite.EnseignementSuperieur].includes(
                      subject.scolarite
                    ),
                  steps: [r("annee_etude")],
                },
                {
                  isActive: (subject) =>
                    [
                      Scolarite.College,
                      Scolarite.Lycee,
                      Scolarite.EnseignementSuperieur,
                    ].includes(subject.scolarite),
                  steps: [r("statuts_etablissement_scolaire")],
                },
                {
                  isActive: (subject) =>
                    [
                      Etudiant.Bts1,
                      Etudiant.But1,
                      Etudiant.Cpge1,
                      Etudiant.Licence1,
                      Etudiant.Licence2,
                    ].includes(subject.annee_etude),
                  steps: [r("mention_baccalaureat")],
                },
                r(Activite.Stagiaire),
              ],
            },
            {
              isActive: (subject, situation, parameters) => {
                const age = IndividuMethods.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                const jeune_actif =
                  subject.activite === Activite.Salarie &&
                  age <=
                    parameters[
                      "prestations_sociales.education.carte_des_metiers.age_maximal"
                    ]
                return subject.activite === Activite.Etudiant || jeune_actif
              },
              steps: [
                r("alternant"),
                {
                  isActive: (subject) => subject.alternant,
                  steps: [r("_contrat_alternant"), r("categorie_salarie")],
                },
              ],
            },
            {
              isActive: (subject) => {
                return [
                  Scolarite.Lycee,
                  Scolarite.EnseignementSuperieur,
                  Scolarite.Inconnue,
                ].includes(subject.scolarite)
              },
              steps: [r("groupe_specialites_formation")],
            },
            {
              isActive: (subject) =>
                subject.activite === Activite.Salarie || subject.alternant,
              steps: [r("_nombreMoisDebutContratDeTravail")],
            },
          ]
        : []),
      ...(!enfant
        ? [
            {
              isActive: (subject) => subject.activite === Activite.Chomeur,
              steps: [r("date_debut_chomage"), r("ass_precondition_remplie")],
            },
            {
              isActive: (subject) =>
                ![Activite.Etudiant, ...ACTIVITES_ACTIF].includes(
                  subject.activite
                ),
              steps: [r("inapte_travail")],
            },
          ]
        : []),
      r("handicap"),
      {
        isActive: (subject) => subject.handicap,
        steps: [
          r("taux_incapacite"),
          {
            isActive: (subject, situation, parameters) =>
              !enfant &&
              0.5 <= subject.taux_incapacite &&
              subject.taux_incapacite <
                parameters[
                  "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite"
                ],
            steps: [r("aah_restriction_substantielle_durable_acces_emploi")],
          },
        ],
      },
      ...(enfant
        ? [
            {
              isActive: (subject) => subject.handicap,
              steps: [r("enfant_place")],
            },
          ]
        : []),
      ...(demandeur
        ? [
            {
              isActive: (subject, situation) => {
                const age = IndividuMethods.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                return 8 < age && age <= 25
              },
              steps: [r("enfant_a_charge")],
            },
          ]
        : []),
      ...(enfant
        ? [
            {
              isActive: (subject, situation) => {
                const age = IndividuMethods.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                return 8 < age && age <= 25
              },
              steps: [r("scolarite")],
            },
          ]
        : []),
      ...(demandeur
        ? [
            {
              isActive: (subject, situation) => {
                const age = IndividuMethods.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                const thisYear = datesGenerator(situation.dateDeValeur).thisYear
                  .id
                const enfant_a_charge = subject.enfant_a_charge?.[thisYear]
                return (
                  20 <= age &&
                  age < 25 &&
                  ![Activite.Etudiant, ...ACTIVITES_ACTIF].includes(
                    subject.activite
                  ) &&
                  !subject.ass_precondition_remplie &&
                  !enfant_a_charge
                )
              },
              steps: [r("rsa_jeune_condition_heures_travail_remplie")],
            },
          ]
        : []),
      ...(enfant ? [r("enfant_a_charge")] : []),
      ...(demandeur
        ? [
            {
              isActive: (subject, situation) =>
                60 <=
                IndividuMethods.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                ),
              steps: [r("gir")],
            },
          ]
        : []),
      ...(demandeur
        ? [
            {
              isActive: (subject, situation) => {
                const age = IndividuMethods.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                return age <= 25
              },
              steps: [r("regime_securite_sociale")],
            },
          ]
        : []),
      ...(!enfant ? [r("enceinte")] : []),
    ],
  }
}
