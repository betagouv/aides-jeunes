import Individu from "../individu.js"
import { ACTIVITES_ACTIF } from "../activite.js"
import Ressource from "../ressource.js"
import { generator as datesGenerator } from "../dates.js"
import { Step, ComplexStep } from "./steps.js"
import Scolarite from "../scolarite.js"

import { ActiviteType } from "../enums/activite.js"
import { ScolariteType, EtudiantType } from "../enums/scolarite.js"
import { BlockLayout } from "../types/blocks.js"

function individuBlockFactory(id, chapter?: string) {
  const r = (variable, chapter?: string) =>
    new Step({ entity: "individu", id, variable, chapter })
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
              isActive: (subject) => subject.activite == ActiviteType.etudiant,
              steps: [
                r("scolarite"),
                {
                  isActive: (subject) =>
                    [
                      ScolariteType.lycee,
                      ScolariteType.enseignement_superieur,
                    ].includes(subject.scolarite),
                  steps: [r("annee_etude")],
                },
                {
                  isActive: (subject) =>
                    [
                      ScolariteType.college,
                      ScolariteType.lycee,
                      ScolariteType.enseignement_superieur,
                    ].includes(subject.scolarite),
                  steps: [r("statuts_etablissement_scolaire")],
                },
                {
                  isActive: (subject) =>
                    [
                      EtudiantType.bts_1,
                      EtudiantType.but_1,
                      EtudiantType.cpge_1,
                      EtudiantType.licence_1,
                      EtudiantType.licence_2,
                    ].includes(subject.annee_etude),
                  steps: [r("mention_baccalaureat")],
                },
                r(ActiviteType.stagiaire),
              ],
            },
            {
              isActive: (subject, situation, parameters) => {
                const age = Individu.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                const jeune_actif =
                  subject.activite === ActiviteType.salarie &&
                  age <=
                    parameters[
                      "prestations_sociales.aides_jeunes.carte_des_metiers.age_maximal"
                    ]
                return subject.activite === ActiviteType.etudiant || jeune_actif
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
              isActive: (subject) =>
                subject.activite === "etudiant" &&
                subject.scolarite === "enseignement_superieur",
              steps: [r("echelon_bourse")],
            },
            {
              isActive: (subject) => {
                return [
                  ScolariteType.lycee,
                  ScolariteType.enseignement_superieur,
                  ScolariteType.inconnue,
                ].includes(subject.scolarite)
              },
              steps: [r("groupe_specialites_formation")],
            },
            {
              isActive: (subject) =>
                subject.activite === ActiviteType.salarie || subject.alternant,
              steps: [r("_nombreMoisDebutContratDeTravail")],
            },
          ]
        : []),
      ...(!enfant
        ? [
            {
              isActive: (subject) => subject.activite === ActiviteType.chomeur,
              steps: [r("date_debut_chomage"), r("ass_precondition_remplie")],
            },
            {
              isActive: (subject) =>
                ![ActiviteType.etudiant, ...ACTIVITES_ACTIF].includes(
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
                const age = Individu.age(
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
                const age = Individu.age(
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
                const age = Individu.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                const thisYear = datesGenerator(situation.dateDeValeur).thisYear
                  .id
                const enfant_a_charge = subject.enfant_a_charge?.[thisYear]
                return (
                  20 <= age &&
                  age < 25 &&
                  ![ActiviteType.etudiant, ...ACTIVITES_ACTIF].includes(
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
                Individu.age(
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
                const age = Individu.age(
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
    new Step({ entity: "individu", id, variable, chapter })

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
            Scolarite.groupeSpecialitesFormation
              .specialites_plurivalentes_sanitaires_et_sociales.value
          )
        },
        steps: [s("_interetAidesSanitaireSocial", "projets")],
      },
      {
        isActive: (subject) => subject.annee_etude === EtudiantType.terminale,
        steps: [
          s("sortie_academie"),
          {
            isActive: (subject) => {
              return (
                subject.sortie_academie &&
                typeof subject.bourse_lycee !== "object"
              )
            },
            steps: [new Step({ entity: "famille", variable: "bourse_lycee" })],
          },
        ],
      },
      {
        isActive: (subject) =>
          [EtudiantType.licence_3, EtudiantType.master_1].includes(
            subject.annee_etude
          ),
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
          (subject.scolarite === ScolariteType.enseignement_superieur &&
            ["public", "prive_sous_contrat"].includes(
              subject.statuts_etablissement_scolaire
            )) ||
          subject._contrat_alternant === ActiviteType.apprenti,
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
      new Step({ entity: "enfants", chapter: "foyer" }),
    ],
  }
}

function housingBlock() {
  return {
    subject: (situation) => situation.menage,
    steps: [
      new Step({
        entity: "menage",
        chapter: "logement",
        variable: "_logementType",
      }),
      {
        isActive: (subject) => subject._logementType === "proprietaire",
        steps: [new Step({ entity: "menage", variable: "_primoAccedant" })],
      },
      {
        isActive: (subject) =>
          !subject._logementType || subject._logementType === "locataire",
        steps: [
          new Step({ entity: "menage", variable: "_locationType" }),
          new Step({ entity: "menage", variable: "coloc" }),
          new Step({ entity: "menage", variable: "logement_chambre" }),
          new Step({
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
          new ComplexStep({
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
          new Step({ entity: "menage", variable: "participation_frais" }),
          new Step({
            entity: "individu",
            id: "demandeur",
            variable: "habite_chez_parents",
          }),
        ],
      },
      new Step({ entity: "menage", variable: "depcom" }),
      {
        isActive: (subject) =>
          subject.depcom?.startsWith("75") &&
          subject._logementType != "sansDomicile",
        steps: [new Step({ entity: "famille", variable: "parisien" })],
      },
      {
        subject: (menage, situation) => situation.demandeur,
        isActive: (demandeur, situation) => {
          return (
            demandeur.activite === ActiviteType.etudiant &&
            !demandeur.habite_chez_parents &&
            (!situation.parents ||
              ["decedes", "sans_autorite"].indexOf(
                situation.parents._situation
              ) < 0)
          )
        },
        steps: [
          new Step({ entity: "parents", variable: "_en_france" }),
          {
            subject: (menage, situation) => situation.parents,
            isActive: (parents) => !parents || parents._en_france,
            steps: [
              new Step({
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
          new Step({
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
        new ComplexStep({
          route: `individu/${individuId}/ressources/types`,
          chapter: "revenus",
          entity: "individu",
          variable: "ressources",
          id: individuId,
        }),
      ].concat(
        Ressource.getIndividuRessourceCategories(individu, situation).map(
          (category) =>
            new ComplexStep({
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
            new Step({
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

export function generateBlocks(situation): BlockLayout[] {
  return [
    { steps: [new Step({})] },
    individuBlockFactory("demandeur"),
    kidBlock(situation),
    {
      steps: [
        new Step({ entity: "famille", variable: "en_couple" }),
        {
          isActive: (situation) =>
            situation.enfants?.length && !situation.famille.en_couple,
          steps: [
            new Step({ entity: "famille", variable: "rsa_isolement_recent" }),
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
          (subject.activite === ActiviteType.etudiant &&
            !subject.alternant &&
            !situation.enfants?.length)
        )
      },
      steps: [
        new Step({ entity: "parents", variable: "_situation" }),
        {
          subject: (demandeur, situation) => situation.parents,
          isActive: (parents, situation) => {
            const parents_ok =
              !parents ||
              ["decedes", "sans_autorite"].indexOf(parents._situation) < 0

            const demandeur_ok =
              situation.demandeur.activite === ActiviteType.etudiant &&
              !situation.demandeur.alternant &&
              !situation.enfants?.length

            return parents_ok && demandeur_ok
          },
          steps: [
            new Step({
              entity: "famille",
              variable: "bourse_criteres_sociaux_nombre_enfants_a_charge",
            }),
            new Step({
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
          !situation.parents ||
          ["decedes", "sans_autorite"].indexOf(situation.parents._situation) < 0
        return parents_ok
      },
      steps: [
        {
          isActive: (situation) => {
            const demandeur = situation.demandeur
            const demandeur_ok =
              demandeur &&
              demandeur.activite === ActiviteType.etudiant &&
              !demandeur.alternant &&
              !(situation.enfants && situation.enfants.length)
            return demandeur_ok
          },
          steps: [
            new Step({
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
              demandeur.activite === ActiviteType.etudiant &&
              !demandeur.alternant &&
              !situation.enfants?.length
            return enfant_a_charge && !demandeur_ok_bcs
          },
          steps: [
            new Step({
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
            new Step({
              entity: "parents",
              variable: "nbptr",
            }),
          ],
        },
      ],
    },
    extraBlock(),
    {
      steps: [new Step({ entity: "resultats", chapter: "resultats" })],
    },
    new Step({ entity: "resultats" }),
  ]
}
