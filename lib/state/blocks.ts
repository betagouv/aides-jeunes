import IndividuMethods from "../individu.js"
import { ACTIVITES_ACTIF } from "../activite.js"
import Ressource from "../ressource.js"
import { generator as datesGenerator } from "../dates.js"
import { StepGenerator, ComplexStepGenerator } from "./steps.js"
import ScolariteCategories from "../scolarite.js"

import { Activite } from "../enums/activite.js"
import { Scolarite, Etudiant } from "../enums/scolarite.js"
import { Block } from "../types/blocks.js"

function individuBlockFactory(id, chapter?: string) {
  const r = (variable, chapter?: string) =>
    new StepGenerator({ entity: "individu", id, variable, chapter })
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
      r("date_naissance", demandeur ? "profil" : chapter),
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

function extraBlock() {
  const id = "demandeur"
  const s = (variable: string, chapter?: string) =>
    new StepGenerator({ entity: "individu", id, variable, chapter })

  return {
    subject: (situation) =>
      situation[id] ||
      situation.enfants?.find((enfant) => enfant.id === id) ||
      {},
    steps: [
      s("_interetsAidesVelo", "projets"),
      s("_interetBafa", "projets"),
      s("_interetPermisDeConduire", "projets"),
      {
        isActive: (subject) => {
          return (
            subject.groupe_specialites_formation !==
            ScolariteCategories.groupeSpecialitesFormation
              .specialites_plurivalentes_sanitaires_et_sociales.value
          )
        },
        steps: [s("_interetAidesSanitaireSocial", "projets")],
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

function kidBlock(situation) {
  return {
    steps: [
      ...(situation.enfants?.length
        ? situation.enfants.map((e) => {
            return {
              steps: [individuBlockFactory(e.id, "foyer")],
            }
          })
        : []),
      new StepGenerator({ entity: "enfants", chapter: "foyer" }),
    ],
  }
}

function housingBlock() {
  return {
    subject: (situation) => situation.menage,
    steps: [
      new StepGenerator({
        entity: "menage",
        chapter: "logement",
        variable: "_logementType",
      }),
      {
        isActive: (subject) => subject._logementType === "proprietaire",
        steps: [
          new StepGenerator({ entity: "menage", variable: "_primoAccedant" }),
        ],
      },
      {
        isActive: (subject) =>
          !subject._logementType || subject._logementType === "locataire",
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
            !subject._logementType || subject._logementType === "locataire"
          const proprietaire = subject._logementType === "proprietaire"
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
        isActive: (subject) => subject._logementType == "heberge",
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
            situation.menage.statut_occupation_logement === "proprietaire"
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
          subject._logementType != "sansDomicile",
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
          ["locataire", "sansDomicile", "heberge"].includes(
            subject._logementType
          ),
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
          chapter: "revenus",
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
    { steps: [new StepGenerator({})] },
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
      steps: [new StepGenerator({ entity: "resultats", chapter: "resultats" })],
    },
  ]
}
