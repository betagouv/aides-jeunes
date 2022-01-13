const Individu = require("../../../lib/individu")
const { ACTIVITES_ACTIF } = require("../../../lib/activite")
const Ressource = require("@/../lib/ressource")
const { datesGenerator } = require("../../../lib/benefits/compute")
const { Step, ComplexStep } = require("./steps")

function individuBlockFactory(id, chapter) {
  const r = (variable, chapter) =>
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
      ...(enfant ? [r("_firstName")] : []),
      r("date_naissance", demandeur ? "profil" : chapter),
      r("nationalite"),
      ...(conjoint ? [r("statut_marital")] : []),
      ...(enfant ? [r("garde_alternee")] : []),
      ...(!enfant ? [r("activite")] : []),
      ...(demandeur
        ? [
            {
              isActive: (subject) => subject.activite == "etudiant",
              steps: [
                r("scolarite"),
                {
                  isActive: (subject) =>
                    ["lycee", "enseignement_superieur"].includes(
                      subject.scolarite
                    ),
                  steps: [r("annee_etude")],
                },
                {
                  isActive: (subject) =>
                    ["college", "lycee", "enseignement_superieur"].includes(
                      subject.scolarite
                    ),
                  steps: [r("statuts_etablissement_scolaire")],
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
                  steps: [r("mention_baccalaureat")],
                },
                r("stagiaire"),
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
                  age <= parameters["prestations.carte_des_metiers.age_maximal"]
                return subject.activite === "etudiant" || jeune_actif
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
                subject.activite === "salarie" || subject.alternant,
              steps: [r("_nombreMoisDebutContratDeTravail")],
            },
          ]
        : []),
      ...(!enfant
        ? [
            {
              isActive: (subject) => subject.activite == "chomeur",
              steps: [r("date_debut_chomage"), r("ass_precondition_remplie")],
            },
            {
              isActive: (subject) =>
                !["etudiant", ...ACTIVITES_ACTIF].includes(subject.activite),
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
                parameters["prestations.minima_sociaux.aah.taux_incapacite"],
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
      {
        isActive: () => false,
        steps: [r("bourse_criteres_sociaux_echelon")],
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
                  !["etudiant", ...ACTIVITES_ACTIF].includes(
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
  const s = (variable, chapter) =>
    new Step({ entity: "individu", id, variable, chapter })

  return {
    subject: (situation) =>
      situation[id] ||
      situation.enfants?.find((enfant) => enfant.id === id) ||
      {},
    steps: [
      s("_interetBafa", "projets"),
      s("_interetPermisDeConduire", "projets"),
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
          subject.scolarite == "enseignement_superieur" &&
          ["public", "prive_sous_contrat"].includes(
            subject.statuts_etablissement_scolaire
          ),
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
        variable: "statut_occupation_logement",
      }),
      {
        isActive: (subject) =>
          subject.statut_occupation_logement !== "proprietaire" &&
          subject.statut_occupation_logement !== "primo_accedant",
        steps: [
          new Step({
            entity: "menage",
            variable: "_nombreMoisEntreeLogement",
          }),
        ],
      },
      {
        isActive: (subject) =>
          !subject.statut_occupation_logement ||
          subject.statut_occupation_logement.startsWith("locataire"),
        steps: [
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
            !subject.statut_occupation_logement ||
            subject.statut_occupation_logement.startsWith("locataire")
          const proprietaire =
            subject.statut_occupation_logement === "primo_accedant" ||
            subject.statut_occupation_logement === "proprietaire"
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
        isActive: (subject) =>
          subject.statut_occupation_logement == "loge_gratuitement",
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
          subject.statut_occupation_logement != "sans_domicile",
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

function generateBlocks(situation) {
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
    housingBlock(situation),
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

module.exports = {
  generateBlocks,
}
