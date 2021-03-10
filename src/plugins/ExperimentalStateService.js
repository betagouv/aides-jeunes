// situation currentRoute
// fullJourney
// blocks
/*
Demandeur
- DdN
- Nationalité
- handicap
  - 50/80/+
    - RSDAE
Enfants
  - détours
- liste
Conjoint
- en_couple?
  - depuis +/- 18 mois
Logement
Ressources
Parents
Fiscale
Patrimoine
//*/


function individuBlockFactory(id) {
  const r = name => `/simulation/individu/${id}/${name}`
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
      r('date_naissance'),
      r('nationalite'),
      r('handicap'),
    //   {
    //     isActive: (subject) => subject.handicap,
    //     steps: [
    //       r('taux_handicap'),
    //       {
    //         isActive: (subject) => 0.5 <= subject.taux_handicap && subject.taux_handicap <= 0.8,
    //         steps: [
    //           r('aah_restriction_substantielle_durable_acces_emploi'),
    //         ]
    //       }
    //     ]
    //   },
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


function processBlock({journey, subject, situation, current}, b) {
  if (typeof(b) == 'string') {
    journey.push(b)
  } else {
    let blockSubject = b.subject ? b.subject(situation) : (subject || situation)
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
          subject: situation => situation.famille,
          isActive: (subject, situation) => situation.enfants && situation.enfants.length && !subject.en_couple,
          steps: [
            '/simulation/famille/rsa_isolement_recent',
          ]
        }
      ]
    }, {
      steps: [
        '/simulation/resultats',
        '/simulation/resultats'
      ]
    }
  ]

  function processBlocks({situation, current}) {
    let journey = []
    blocks.forEach(b => {
      processBlock({journey, situation, current}, b)
    })
    return journey
  }
  return processBlocks({situation, current})
}

exports.generateJourney = generateJourney
