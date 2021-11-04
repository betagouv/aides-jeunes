const Individu = require("@/lib/Individu")
const { ACTIVITES_ACTIF } = require("../../../lib/Activite")
const Ressource = require("../../../lib/ressource")
const { datesGenerator } = require("../../../backend/lib/mes-aides")
const { Step, ComplexStep } = require("./steps")
const { getAnswer } = require("../../../lib/answers")

function individuBlockFactory(answers, parameters, id, chapter) {
  const r = (variable, chapter) =>
    new Step({ entity: "individu", id, variable, chapter })
  const conjoint = id == "conjoint"
  const demandeur = id == "demandeur"
  const enfant = id.startsWith("enfant")

  const getIndividuAnswer = (variable) =>
    getAnswer(answers.all, "individu", variable, id)

  const activite = getIndividuAnswer("activite")
  const anneeEtude = getIndividuAnswer("annee_etude")
  const scolarite = getIndividuAnswer("scolarite")
  const age = Individu.age(
    getIndividuAnswer("date_naissance"),
    datesGenerator(answers.dateDeValeur).today.value
  )
  const jeune_actif =
    activite === "salarie" &&
    age <= parameters["prestations.carte_des_metiers.age_maximal"]
  const alternant = getIndividuAnswer("alternant")
  const handicap = getIndividuAnswer("handicap")
  const enfant_a_charge = getIndividuAnswer("enfant_a_charge")

  const continuite_etudes = getIndividuAnswer("_continuite_etudes")
  return {
    isActive: true,
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
              isActive: activite === "etudiant",
              steps: [
                r("scolarite"),
                {
                  isActive:
                    scolarite === "lycee" ||
                    scolarite === "enseignement_superieur",
                  steps: [r("annee_etude")],
                },
                {
                  isActive:
                    anneeEtude === "licence_1" || anneeEtude === "licence_2",
                  steps: [r("mention_baccalaureat")],
                },
                {
                  isActive: scolarite === "enseignement_superieur",
                  steps: [r("statuts_etablissement_scolaire")],
                },
              ],
            },
            {
              isActive: activite === "etudiant" || jeune_actif,
              steps: [
                r("alternant"),
                {
                  isActive: alternant,
                  steps: [r("_contrat_alternant")],
                },
              ],
            },
            {
              isActive: activite === "salarie" || alternant,
              steps: [r("_nombreMoisDebutContratDeTravail")],
            },
          ]
        : []),
      ...(!enfant
        ? [
            {
              isActive: activite === "chomeur",
              steps: [r("date_debut_chomage"), r("ass_precondition_remplie")],
            },
            {
              isActive: !["etudiant", ...ACTIVITES_ACTIF].includes(activite),
              steps: [r("inapte_travail")],
            },
          ]
        : []),
      r("handicap"),
      {
        isActive: handicap,
        steps: [
          r("taux_incapacite"),
          {
            isActive: (parameters) => {
              const tauxIncapacite = getIndividuAnswer("taux_incapacite")
              return (
                !enfant &&
                0.5 <= tauxIncapacite &&
                tauxIncapacite <
                  parameters["prestations.minima_sociaux.aah.taux_incapacite"]
              )
            },
            steps: [r("aah_restriction_substantielle_durable_acces_emploi")],
          },
        ],
      },
      ...(enfant
        ? [
            {
              isActive: handicap,
              steps: [r("enfant_place")],
            },
          ]
        : []),
      {
        isActive: false,
        steps: [r("bourse_criteres_sociaux_echelon")],
      },
      ...(demandeur
        ? [
            {
              isActive: 8 < age && age <= 25,
              steps: [r("enfant_a_charge")],
            },
          ]
        : []),
      ...(enfant
        ? [
            {
              isActive: 8 < age && age <= 25,
              steps: [r("scolarite")],
            },
          ]
        : []),
      ...(demandeur
        ? [
            {
              isActive:
                20 <= age &&
                age < 25 &&
                !["etudiant", ...ACTIVITES_ACTIF].includes(activite) &&
                !getIndividuAnswer("ass_precondition_remplie") &&
                !enfant_a_charge,
              steps: [r("rsa_jeune_condition_heures_travail_remplie")],
            },
          ]
        : []),
      ...(enfant ? [r("enfant_a_charge")] : []),
      ...(demandeur
        ? [
            {
              isActive: 60 <= age,
              steps: [r("gir")],
            },
          ]
        : []),
      ...(demandeur
        ? [
            {
              isActive: activite === "etudiant",
              steps: [r("_continuite_etudes")],
            },
            {
              isActive:
                !continuite_etudes &&
                ["etudiant", "chomeur", "inactif"].includes(activite),
              steps: [
                r("plus_haut_diplome_niveau"),
                {
                  isActive: [
                    "niveau_5",
                    "niveau_6",
                    "niveau_7",
                    "niveau_8",
                  ].includes(getIndividuAnswer("plus_haut_diplome_niveau")),
                  steps: [
                    r("plus_haut_diplome_date_obtention"),
                    {
                      isActive:
                        getIndividuAnswer("plus_haut_diplome_date_obtention") >=
                        new Date("2019-12-31 00:00:00"),
                      steps: [
                        r("_boursier_derniere_annee_etudes"),
                        {
                          isActive: getIndividuAnswer(
                            "_boursier_derniere_annee_etudes"
                          ),
                          steps: [
                            r(
                              "aide_jeunes_diplomes_anciens_boursiers_base_ressources"
                            ),
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              isActive: age <= 25,
              steps: [r("regime_securite_sociale")],
            },
          ]
        : []),
      ...(!enfant ? [r("enceinte")] : []),
    ],
  }
}

function extraBlock(answers) {
  const id = "demandeur"
  const s = (variable, chapter) =>
    new Step({ entity: "individu", id, variable, chapter })

  const getIndividuAnswer = (variable) =>
    getAnswer(answers.all, "individu", variable, "demandeur")
  const anneEtude = getIndividuAnswer("annee_etude")

  return {
    isActive: true,
    steps: [
      s("_interetPermisDeConduire", "projets"),
      {
        isActive: getIndividuAnswer("annee_etude") == "terminale",
        steps: [
          s("sortie_academie"),
          {
            isActive:
              getIndividuAnswer("sortie_academie") &&
              typeof getIndividuAnswer("bourse_lycee") !== "object",
            steps: [new Step({ entity: "famille", variable: "bourse_lycee" })],
          },
        ],
      },
      {
        isActive: anneEtude == "licence_3" || anneEtude == "master_1",
        steps: [
          s("sortie_region_academique"),
          {
            isActive: getIndividuAnswer("sortie_region_academique"),
            steps: [s("boursier")],
          },
        ],
      },
      {
        isActive:
          getIndividuAnswer("scolarite") == "enseignement_superieur" &&
          ["public", "prive_sous_contrat"].includes(
            getIndividuAnswer("statuts_etablissement_scolaire")
          ),
        steps: [
          s("_interetEtudesEtranger"),
          {
            isActive: getIndividuAnswer("_interetEtudesEtranger"),
            steps: [s("_dureeMoisEtudesEtranger")],
          },
        ],
      },
    ],
  }
}

function kidBlock(answers, parameters) {
  return {
    isActive: true,
    steps: [
      ...(answers.enfants && answers.enfants.length
        ? answers.enfants.map((id) => {
            return {
              isActive: true,
              steps: [
                individuBlockFactory(
                  answers,
                  parameters,
                  `enfant_${id}`,
                  "foyer"
                ),
              ],
            }
          })
        : []),
      new Step({ entity: "enfants", chapter: "foyer" }),
    ],
  }
}

function housingBlock(answers) {
  const getMenageAnswers = (variable) =>
    getAnswer(answers.all, "menage", variable)
  const status = getMenageAnswers("statut_occupation_logement")
  const locataire = !status || status.startsWith("locataire")
  const proprietaire =
    status && (status === "primo_accedant" || status === "proprietaire")
  const depcom = getMenageAnswers("depcom")
  const activite = getAnswer(answers.all, "individu", "activite", "demandeur")
  const habiteChezParents = getAnswer(
    answers.all,
    "individu",
    "habite_chez_parents",
    "demandeur"
  )
  const parentsSituation = getAnswer(answers.all, "parents", "_situation")
  return {
    isActive: true,
    steps: [
      new Step({
        entity: "menage",
        chapter: "logement",
        variable: "statut_occupation_logement",
      }),
      {
        isActive: status !== "proprietaire" && status !== "primo_accedant",
        steps: [
          new Step({
            entity: "menage",
            variable: "_nombreMoisEntreeLogement",
          }),
        ],
      },
      {
        isActive: !status || status.startsWith("locataire"),
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
        isActive: locataire || proprietaire,
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
        isActive: status == "loge_gratuitement",
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
        isActive:
          depcom &&
          depcom._codePostal &&
          depcom._codePostal.startsWith("75") &&
          status != "sans_domicile",
        steps: [new Step({ entity: "famille", variable: "parisien" })],
      },
      {
        isActive:
          activite == "etudiant" &&
          !habiteChezParents &&
          ["decedes", "sans_autorite"].indexOf(parentsSituation) < 0,
        steps: [
          new Step({ entity: "parents", variable: "_en_france" }),
          {
            isActive: getAnswer(answers.all, "parents", "_en_france"),
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

function resourceBlocks(answers) {
  const individuResourceBlock = (individuId) => {
    return {
      isActive: true,
      steps: [
        new ComplexStep({
          route: `individu/${individuId}/ressources/types`,
          chapter: "revenus",
          entity: "individu",
          variable: "ressources",
          id: individuId,
        }),
      ].concat(
        Ressource.getIndividuRessourceCategories(answers, individuId).map(
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
  const enCouple = getAnswer(answers.all, "famille", "en_couple")

  return {
    isActive: true,
    steps: [
      individuResourceBlock("demandeur"),
      ...(enCouple ? [individuResourceBlock("conjoint")] : []),
      ...(answers.enfants && answers.enfants.length
        ? [
            new Step({
              entity: "individu",
              variable: "_hasRessources",
              id: "enfants",
            }),
          ]
        : []),
      {
        isActive: true,
        steps: answers.enfants
          ? answers.enfants.map((e) => {
              const enfantId = `enfant_${e}`
              const childWithRessources = getAnswer(
                answers.all,
                "individu",
                "_hasRessources",
                "enfants"
              )
              const hasRessources =
                childWithRessources &&
                childWithRessources.find((response) => {
                  console.log(response.id, enfantId)
                  return response.id === enfantId
                })

              return hasRessources && hasRessources.value
                ? individuResourceBlock(enfantId)
                : { steps: [] }
            })
          : [],
      },
    ],
  }
}

function generateBlocks(answers, parameters) {
  const enfant_a_charge = getAnswer(
    answers.all,
    "individu",
    "enfant_a_charge",
    "demandeur"
  )

  const activite = getAnswer(answers.all, "individu", "activite", "demandeur")
  const alternant = getAnswer(answers.all, "individu", "alternant", "demandeur")

  const parentsSituation = getAnswer(answers.all, "parents", "_situation")
  const enCouple = getAnswer(answers.all, "famille", "en_couple")
  return [
    { isActive: true, steps: [new Step({})] },
    individuBlockFactory(answers, parameters, "demandeur"),
    kidBlock(answers),
    {
      isActive: true,
      steps: [
        new Step({ entity: "famille", variable: "en_couple" }),
        {
          isActive: answers.enfants && answers.enfants.length && !enCouple,
          steps: [
            new Step({ entity: "famille", variable: "rsa_isolement_recent" }),
          ],
        },
        ...(enCouple
          ? [individuBlockFactory(answers, parameters, "conjoint")]
          : []),
      ],
    },
    {
      isActive:
        enfant_a_charge ||
        (activite === "etudiant" &&
          !alternant &&
          !(answers.enfants && answers.enfants.length)),
      steps: [
        new Step({ entity: "parents", variable: "_situation" }),
        {
          isActive:
            ["decedes", "sans_autorite"].indexOf(parentsSituation) < 0 &&
            activite == "etudiant" &&
            !alternant &&
            !(answers.enfants && answers.enfants.length),
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
    housingBlock(answers),
    resourceBlocks(answers),
    {
      isActive: ["decedes", "sans_autorite"].indexOf(parentsSituation) < 0,
      steps: [
        {
          isActive:
            activite == "etudiant" &&
            !alternant &&
            !(answers.enfants && answers.enfants.length),
          steps: [
            new Step({
              entity: "individu",
              id: "demandeur",
              variable: "bourse_criteres_sociaux_base_ressources_parentale",
            }),
          ],
        },
        {
          isActive:
            enfant_a_charge &&
            (activite !== "etudiant" ||
              alternant ||
              (answers.enfants && answers.enfants.length)),
          steps: [
            new Step({
              entity: "parents",
              variable: "rfr",
            }),
          ],
        },
        {
          isActive: enfant_a_charge,
          steps: [
            new Step({
              entity: "parents",
              variable: "nbptr",
            }),
          ],
        },
      ],
    },
    extraBlock(answers),
    {
      isActive: true,
      steps: [new Step({ entity: "resultats", chapter: "resultats" })],
    },
    new Step({ entity: "resultats" }),
  ]
}

module.exports = {
  generateBlocks,
}
