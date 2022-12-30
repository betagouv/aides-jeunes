import Individu from "../individu"
import { ACTIVITES_ACTIF } from "../activite"
import Ressource from "../ressource"
import { generator as datesGenerator } from "../dates"
import { Step, ComplexStep } from "./steps"
import Scolarite from "../scolarite"

import { BlockLayout } from "../types/blocks"

function individuBlockFactory(id, chapter?: string) {
  const individuStep = (variable, chapter?: string) =>
    new Step({ entity: "individu", id, variable, chapter })
  const conjoint = id == "conjoint"
  const demandeur = id == "demandeur"
  const enfant = id.startsWith("enfant")

  function buildEnfantSteps() {
    return [
      individuStep("_firstName", chapter),
      individuStep("garde_alternee"),
      individuStep("activite"),
      {
        isActive: (subject) => subject.activite == "chomeur",
        steps: [
          individuStep("date_debut_chomage"),
          individuStep("ass_precondition_remplie"),
        ],
      },
      {
        isActive: (subject) =>
          !["etudiant", ...ACTIVITES_ACTIF].includes(subject.activite),
        steps: [individuStep("inapte_travail")],
      },
      {
        isActive: (subject) => subject.handicap,
        steps: [individuStep("enfant_place")],
      },
      {
        isActive: (subject, situation) => {
          const age = Individu.age(
            subject,
            datesGenerator(situation.dateDeValeur).today.value
          )
          return 8 < age && age <= 25
        },
        steps: [individuStep("scolarite")],
      },
      individuStep("enfant_a_charge"),
      individuStep("enceinte"),
    ]
  }

  return {
    subject: (situation) =>
      situation[id] ||
      situation.enfants?.find((enfant) => enfant.id === id) ||
      {},
    steps: [
      ...(enfant ? buildEnfantSteps() : []),
      individuStep("date_naissance", demandeur ? "profil" : chapter),
      individuStep("nationalite"),
      ...(conjoint ? [individuStep("statut_marital")] : []),
      ...(demandeur
        ? [
            {
              isActive: (subject) => subject.activite == "etudiant",
              steps: [
                individuStep("scolarite"),
                {
                  isActive: (subject) =>
                    ["lycee", "enseignement_superieur"].includes(
                      subject.scolarite
                    ),
                  steps: [individuStep("annee_etude")],
                },
                {
                  isActive: (subject) =>
                    ["college", "lycee", "enseignement_superieur"].includes(
                      subject.scolarite
                    ),
                  steps: [individuStep("statuts_etablissement_scolaire")],
                },
                {
                  isActive: (subject) =>
                    [
                      "bts_1",
                      "but_1",
                      "cpge_1",
                      "licence_1",
                      "licence_2",
                    ].includes(subject.annee_etude),
                  steps: [individuStep("mention_baccalaureat")],
                },
                individuStep("stagiaire"),
              ],
            },
            {
              isActive: (subject, situation, parameters) => {
                const age = Individu.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                )
                const jeune_actif =
                  subject.activite === "salarie" &&
                  age <=
                    parameters[
                      "prestations_sociales.aides_jeunes.carte_des_metiers.age_maximal"
                    ]
                return subject.activite === "etudiant" || jeune_actif
              },
              steps: [
                individuStep("alternant"),
                {
                  isActive: (subject) => subject.alternant,
                  steps: [
                    individuStep("_contrat_alternant"),
                    individuStep("categorie_salarie"),
                  ],
                },
              ],
            },
            {
              isActive: (subject) => {
                return ["lycee", "enseignement_superieur", "inconnue"].includes(
                  subject.scolarite
                )
              },
              steps: [individuStep("groupe_specialites_formation")],
            },
            {
              isActive: (subject) =>
                subject.activite === "salarie" || subject.alternant,
              steps: [individuStep("_nombreMoisDebutContratDeTravail")],
            },
          ]
        : []),
      individuStep("handicap"),
      {
        isActive: (subject) => subject.handicap,
        steps: [
          individuStep("taux_incapacite"),
          {
            isActive: (subject, situation, parameters) =>
              !enfant &&
              0.5 <= subject.taux_incapacite &&
              subject.taux_incapacite <
                parameters[
                  "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite"
                ],
            steps: [
              individuStep(
                "aah_restriction_substantielle_durable_acces_emploi"
              ),
            ],
          },
        ],
      },
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
              steps: [individuStep("enfant_a_charge")],
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
                  !["etudiant", ...ACTIVITES_ACTIF].includes(
                    subject.activite
                  ) &&
                  !subject.ass_precondition_remplie &&
                  !enfant_a_charge
                )
              },
              steps: [
                individuStep("rsa_jeune_condition_heures_travail_remplie"),
              ],
            },
          ]
        : []),
      ...(demandeur
        ? [
            {
              isActive: (subject, situation) =>
                60 <=
                Individu.age(
                  subject,
                  datesGenerator(situation.dateDeValeur).today.value
                ),
              steps: [individuStep("gir")],
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
              steps: [individuStep("regime_securite_sociale")],
            },
          ]
        : []),
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
        isActive: (subject) => subject.annee_etude == "terminale",
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
          subject.annee_etude == "licence_3" ||
          subject.annee_etude == "master_1",
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
          (subject.scolarite === "enseignement_superieur" &&
            ["public", "prive_sous_contrat"].includes(
              subject.statuts_etablissement_scolaire
            )) ||
          subject._contrat_alternant === "apprenti",
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
            demandeur.activite == "etudiant" &&
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
        isActive: (subject) => subject._logementType !== "proprietaire",
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
          (subject.activite == "etudiant" &&
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
              situation.demandeur.activite == "etudiant" &&
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
              demandeur.activite == "etudiant" &&
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
              demandeur.activite == "etudiant" &&
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
