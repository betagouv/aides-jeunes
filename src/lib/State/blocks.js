const Individu = require('@/lib/Individu');
const Ressource = require('@/lib/Ressource').default;
const { datesGenerator } = require('../../../backend/lib/mes-aides');
const { Step, ComplexStep } = require('./steps');

function individuBlockFactory(id) {
  const r = (variable, chapter) => new Step({entity: 'individu', id, variable, chapter})
  const conjoint = id == 'conjoint'
  const demandeur = id == 'demandeur'
  const enfant = id.startsWith('enfant')
  return {
    subject: situation => situation[id] || situation.enfants.find(enfant => enfant.id === id) || {},
    steps: [
      ...(enfant ? [r('_firstName')] : []),
      r('date_naissance', demandeur ? 'profil' : undefined),
      r('nationalite'),
      ...(conjoint ? [r('statut_marital')] : []),
      ...(enfant ? [r('garde_alternee')] : []),
      ...(!enfant ? [r('activite')] : []),
      ...(demandeur ? [{
        isActive: subject => subject.activite == 'etudiant',
        steps: [
          r('scolarite'),
          {
            isActive: subject => subject.scolarite == 'lycee' || subject.scolarite == 'enseignement_superieur',
            steps: [
              r('classe_scolarite'),
            ]
          },
          {
            isActive: subject => subject.scolarite == 'enseignement_superieur',
            steps: [
              r('statuts_etablissement_scolaire'),
            ]
          },
          r('alternant')
        ]
      }] : []),
      ...(!enfant ? [
        {
          isActive: subject => subject.activite == 'chomeur',
          steps: [
            r('date_debut_chomage'),
            r('ass_precondition_remplie')
          ]
        },
        {
          isActive: subject => subject.activite != 'actif' && subject.activite != 'etudiant',
          steps: [
            r('inapte_travail'),
          ]
        },
      ] : []),
      r('handicap'),
      {
        isActive: subject => subject.handicap,
        steps: [
          r('taux_incapacite'),
          {
            isActive: subject => !enfant && 0.5 <= subject.taux_incapacite && subject.taux_incapacite < 0.8,
            steps: [
              r('aah_restriction_substantielle_durable_acces_emploi'),
            ]
          }
        ]
      },
      ...(enfant ? [{
        isActive: subject => subject.handicap,
        steps: [
          r('enfant_place'),
        ]
      }] : []),
      {
        isActive: () => false,
        steps: [r('echelon_bourse')]
      },
      ...(demandeur ? [{
        isActive: (subject, situation) => {
          const age = Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value);
          return 8 < age && age <= 25
        },
        steps: [r('enfant_a_charge')]
      }] : []),
      ...(enfant ? [{
        isActive: (subject, situation) => {
          const age = Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value);
          return 8 < age && age <= 25
        },
        steps: [r('scolarite')]
      }] : []),
      ...(demandeur ? [{
        isActive: (subject, situation) => {
          const age = Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value);
          const thisYear = datesGenerator(situation.dateDeValeur).thisYear.id
          const enfant_a_charge = subject.enfant_a_charge && subject.enfant_a_charge[thisYear]
          return 20 <= age && age < 25 && subject.activite !== 'etudiant' && subject.activite !== 'actif' && !subject.ass_precondition_remplie && !enfant_a_charge
        },
        steps: [r('rsa_jeune_condition_heures_travail_remplie')]
      }] : []),
      ...(enfant ? [r('enfant_a_charge')] : []),
      ...(demandeur ? [{
        isActive: (subject, situation) => 60 <= Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value),
        steps: [r('gir')]
      }] : [])
    ]
  }
}

function extraBlock() {
  const id = 'demandeur'
  const s = (variable, chapter) => new Step({entity: 'individu', id, variable, chapter})

  return {
    subject: situation => situation[id] || situation.enfants.find(enfant => enfant.id === id) || {},
    steps: [
      s('_interetPermisDeConduire', 'projets'),
      {
        isActive: subject => subject.classe_scolarite == 'terminale',
        steps: [
          s('aide_mobilite_parcoursup_sortie_academie'),
          {
            isActive: subject => subject.aide_mobilite_parcoursup_sortie_academie,
            steps: [
              s('aide_mobilite_parcoursup_boursier_lycee'),
            ]
          }
        ]
      },
      {
        isActive: subject => subject.classe_scolarite == 'licence_3' || subject.classe_scolarite == 'master_1',
        steps: [
          s('aide_mobilite_master_sortie_region_academique'),
          {
            isActive: subject => subject.aide_mobilite_master_sortie_region_academique,
            steps: [
              s('boursier'),
            ]
          }
        ]
      },
    ]
  }
}

function kidBlock(situation) {
  return {
    steps: [
      new Step({entity: 'enfants', chapter: 'foyer'}),
      ...(situation.enfants.length ? (situation.enfants.map(e => {
        return {
          steps: [individuBlockFactory(e.id), new Step({entity: 'enfants', key:`enfants#${e.id}`})]
        }
      })) : [])
    ]
  }
}

function housingBlock() {
  return {
    subject: situation => situation.menage,
    steps: [
      new Step({entity: 'logement', chapter: 'logement'}),
      {
        isActive: subject => !subject.statut_occupation_logement || subject.statut_occupation_logement.startsWith("locataire"),
        steps: [
          new Step({entity: 'menage', variable: 'coloc'}),
          new Step({entity: 'menage', variable: 'logement_chambre'}),
          new Step({entity: 'famille', variable: 'proprietaire_proche_famille'}),
        ]
     },
     {
        isActive: subject => {
          const locataire = (! subject.statut_occupation_logement) || subject.statut_occupation_logement.startsWith("locataire")
          const proprietaire = subject.statut_occupation_logement && (subject.statut_occupation_logement === 'primo_accedant' || subject.statut_occupation_logement === 'proprietaire')
          return locataire || proprietaire
        },
        steps: [
          new ComplexStep({
            route: 'menage/loyer',
            variables: [
              {entity: 'menage', variable: 'loyer'},
              {entity: 'menage', variable: 'charges_locatives'},
            ]}),
        ]
     },
     {
        isActive: subject => subject.statut_occupation_logement == "loge_gratuitement",
        steps: [
          new Step({entity: 'menage', variable: 'participation_frais'}),
          new Step({entity: 'individu', id: 'demandeur', variable: 'habite_chez_parents'}),
        ]
     },
     new Step({entity: 'menage', variable: 'depcom'}),
     {
        isActive: subject => subject.depcom && subject.depcom.startsWith('75') && subject.statut_occupation_logement != 'sans_domicile',
        steps: [
          new Step({entity: 'famille', variable: 'parisien'}),
        ],
     },
     {
        subject: (menage, situation) => situation.demandeur,
        isActive: subject => {
          return subject.activite == 'etudiant' && !subject.habite_chez_parents
        },
        steps: [
          new Step({entity: 'individu', id: 'demandeur', variable: '_bourseCriteresSociauxCommuneDomicileFamilial'}),
        ],
     }
    ]
  }
}

function resourceBlocks(situation) {
  const individuResourceBlock = (individuId) => {
    const individu = situation[individuId] || situation.enfants.find(enfant => enfant.id === individuId) || {}
    return {
      steps: [
        new ComplexStep({route: `individu/${individuId}/ressources/types`, chapter: 'revenus'})
      ].concat(
          Ressource.getIndividuRessourceCategories(individu, situation).map(category => new ComplexStep({route: `individu/${individuId}/ressources/montants/${category}`}))
      )
    }
  }
  return {
    steps: [
      individuResourceBlock('demandeur'),
      ...(situation.conjoint ? [individuResourceBlock('conjoint')] : []),
      ...(situation.enfants.length ? [new Step({entity:'enfants', variable: 'ressources'})] : []),
      {
        steps: situation.enfants.map(e => {
          return e._hasRessources ? individuResourceBlock(e.id) : {steps: []}
        })
      }
    ]
  }
}

function generateBlocks(situation) {
  return [
    {steps: [new Step({})]},
    individuBlockFactory('demandeur'),
    kidBlock(situation),
    {
      steps: [
        new Step({entity: 'famille', variable: 'en_couple'}),
        {
          isActive: (situation) => situation.enfants && situation.enfants.length && !situation.famille.en_couple,
          steps: [
            new Step({entity: 'famille', variable: 'rsa_isolement_recent'}),
          ]
        },
        ...(situation.conjoint ? [individuBlockFactory('conjoint')] : []),
      ]
    },
    {
      subject: situation => situation.demandeur,
      isActive: (subject, situation) => {
        return subject.activite == 'etudiant' && !situation.enfants.length
      },
      steps: [
        new Step({entity:'famille', variable: 'bourse_criteres_sociaux_nombre_enfants_a_charge'}),
        new Step({entity:'famille', variable: 'bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur'}),
      ]
    },
    housingBlock(situation),
    resourceBlocks(situation),
    {
      subject: situation => situation,
      isActive: situation => situation.famille && situation.famille.bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur > 0,
      steps: [
        new Step({entity:'individu', id:'demandeur', variable: 'bourse_criteres_sociaux_base_ressources_parentale'}),
      ]
    },
    extraBlock(),
    {
      steps: [
        new Step({entity: 'resultats', chapter: 'resultats'}),
        new Step({entity: 'resultats'})
      ]
    }
  ]
}

module.exports = {
  generateBlocks,
}
