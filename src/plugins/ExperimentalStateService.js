const Individu = require('@/lib/Individu').default;
const Ressource = require('@/lib/Ressource').default;
const { datesGenerator } = require('../../backend/lib/mes-aides');

function individuBlockFactory(id) {
  const r = name => `/simulation/individu/${id}/${name}`
  const conjoint = id == 'conjoint'
  const demandeur = id == 'demandeur'
  const enfant = id.startsWith('enfant')
  return {
    subject: situation => situation[id] || situation.enfants.find(enfant => enfant.id === id) || {},
    steps: [
      ...(enfant ? [r('_firstName')] : []),
      r('date_naissance'),
      r('nationalite'),
      ...(conjoint ? [r('statut_marital')] : []),
      ...(enfant ? [r('garde_alternee')] : []),
      ...(!enfant ? [r('activite')] : []),
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
      ...(!enfant ? [
        r('inapte_travail'),
        {
          isActive: subject => subject.activite == 'chomeur',
          steps: [
            r('date_debut_chomage'),
            r('ass_precondition_remplie')
          ]
        }
      ] : []),
      ...(enfant ? [{
        isActive: subject => subject.handicap,
        steps: [
          r('enfant_place'),
        ]
      }] : []),
      {
        isActive: subject => subject.activite == 'etudiant',
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
      ...(enfant ? [r('enfant_a_charge')] : []),
      ...(demandeur ? [{
        isActive: (subject, situation) => 60 <= Individu.age(subject, datesGenerator(situation.dateDeValeur).today.value),
        steps: [r('gir')]
      }] : [])
    ]
  }
}

function kidBlock(situation, current) {
  // if currently on a kid
  // finish local states and go to main kids view and proceed
  // console.log('kidBlock', situation, current.name)
  if (current.params && current.params.id && current.params.id.startsWith('enfant_')) {
    let block = individuBlockFactory(current.params.id)
    block.steps.push('/simulation/enfants')
    return block
  } else {
    return {
      steps: [
      '/simulation/enfants'
      ]
    }
  }
}

function housingBlock(/*situation, current*/) {
  return {
    subject: situation => situation.menage,
    steps: [
      '/simulation/logement',
      {
        isActive: subject => subject.statut_occupation_logement && (subject.statut_occupation_logement === 'primo_accedant' || subject.statut_occupation_logement === 'proprietaire'),
        steps: [
          '/simulation/menage/loyer'
        ]
     }, {
        isActive: subject => !subject.statut_occupation_logement || subject.statut_occupation_logement.startsWith("locataire"),
        steps: [
          '/simulation/menage/coloc',
          '/simulation/menage/logement_chambre',
          '/simulation/famille/proprietaire_proche_famille',
          '/simulation/menage/loyer',
        ]
     }, {
        isActive: subject => subject.statut_occupation_logement == "loge_gratuitement",
        steps: [
          '/simulation/menage/participation_frais',
          '/simulation/individu/demandeur/habite_chez_parents',
        ]
     },
     '/simulation/menage/depcom',
     {
        isActive: subject => subject.depcom && subject.depcom.startsWith('75'),
        steps: ['/simulation/famille/parisien'],
     }
    ]
  }
}

function resourceBlocks(situation/*, current*/) {
  const individuResourceBlock = (individuId) => {
    const individu = situation[individuId] || situation.enfants.find(enfant => enfant.id === individuId) || {}
    return {
      steps: [
        `/simulation/individu/${individuId}/ressources/types`
      ].concat(
          Ressource.getIndividuRessourceCategories(individu).map(category => `/simulation/individu/${individuId}/ressources/montants/${category}`)
      )
    }
  }
  return {
    steps: [
      individuResourceBlock('demandeur'),
      ...(situation.conjoint ? [individuResourceBlock('conjoint')] : []),
      ...(situation.enfants.length ? ['/simulation/enfants/ressources'] : []),
      {
        steps: situation.enfants.map(e => {
          return e._hasRessources ? individuResourceBlock(e.id) : {steps: []}
        })
      }
    ]
  }
}

function processBlock({journey, subject, situation, current}, b) {
  if (typeof(b) == 'string') {
    journey.push(b)
  } else {
    let blockSubject = b.subject ? b.subject(subject, situation) : (subject || situation)
    if (!b.isActive || b.isActive(blockSubject, situation, current)) {
      b.steps.forEach(s => processBlock({journey, subject: blockSubject, situation, current}, s))
    }
  }
}

// First pass => block list generation
// Second pass => block processint
function generateJourney(situation, current) {
  const blocks = [
    {steps: ['/']},
    individuBlockFactory('demandeur'),
    kidBlock(situation, current),
    {
      steps: [
        '/simulation/famille/en_couple', {
          isActive: (situation) => situation.enfants && situation.enfants.length && !situation.famille.en_couple,
          steps: [
            '/simulation/famille/rsa_isolement_recent',
          ]
        },
        ...(situation.conjoint ? [individuBlockFactory('conjoint')] : []),
      ]
    },
    housingBlock(situation, current),
    resourceBlocks(situation, current),
    {
      steps: [
        '/simulation/resultats',
        '/simulation/resultats'
      ]
    }
  ]

  function processBlocks({situation, current}) {
    let journey = []
    blocks.forEach(b => {
      processBlock({journey, subject: situation, situation, current}, b)
    })
    return journey
  }
  return processBlocks({situation, current})
}

exports.generateJourney = generateJourney
