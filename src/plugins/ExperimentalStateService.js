
function individuBlockFactory(id) {
  const r = name => `/simulation/individu/${id}/${name}`
  const conjoint = id == 'conjoint'
  const demandeur = id == 'demandeur'
  const enfant = id.startsWith('enfant')
  return {
    subject: situation => {
      if (situation[id]) {
        return situation[id]
      } else if (situation.enfants && situation.enfants.length) {
        let matches = situation.enfants.filter(e => e.id == id)
        return matches.length && matches[0]
      }
    },
    steps: [
      ...(enfant ? [r('_firstName')] : []),
      r('date_naissance'),
      r('nationalite'),
      ...(conjoint? [r('statut_marital')] : []),
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
        r('inapte_travail'),{
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
          r('date_debut_chomage'),
          r('ass_precondition_remplie')
        ]
      }] : []),
      {
        isActive: subject => subject.activite == 'etudiant',
        steps: [r('echelon_bourse')]
      },
      ...(demandeur ? [{
        isActive: subject => subject.date_naissance  /* 18 <= age && age < 25 TODO */,
        steps: [r('enfant_a_charge')]
      }] : []),
      ...(enfant ? [{
        isActive: subject => subject.date_naissance /* 8 < age && age <= 25 TODO */,
        steps: [r('scolarite')]
      }] : []),
      ...(enfant ? [r('enfant_a_charge')] : []),
      ...(demandeur ? [{
        isActive: subject => subject.date_naissance /* 60 <= age TODO */,
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
        isActive: subject => subject.statut_occupation_logement && subject.statut_occupation_logement.startsWith("proprietaire"),
        steps: [
          '/simulation/menage/loyer',
          '/simulation/foyer_fiscal/taxe_fonciere_sur_avis'
        ]
     }, {
        isActive: subject => !subject.statut_occupation_logement || subject.statut_occupation_logement.startsWith("locataire"),
        steps: [
          '/simulation/menage/coloc',
          '/simulation/menage/logement_chambre',
          '/simulation/famille/proprietaire_proche_famille',
          '/simulation/famille/loyer+charges',
        ]
     }, {
        isActive: subject => subject.statut_occupation_logement == "loge_gratuitement",
        steps: [
          '/simulation/menage/participation_frais',
          '/simulation/demandeur/habite_chez_parents',
        ]
     }, ...[
        '/simulation/menage/depcom',
     ],
     {
        isActive: subject => subject.depcom && subject.depcom.startsWith('75'),
        steps: ['/simulation/famille/parisien'],
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
        }
      ]
    },
    housingBlock(situation, current),
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
