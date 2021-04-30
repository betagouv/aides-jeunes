const texts = {
  handicap: function(variation) {
      if (variation && variation.includes('enfant')) {
          return `Votre enfant est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
      } else if (variation && variation.includes('conjoint')) {
          return `Votre conjoint est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
      } else {
          return `Vous êtes « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci vous a reconnu comme tel·le et qu'elle vous a également attribué un « taux d'incapacité » lié à votre handicap.`
      }
  },
  enfants: function() {
    return `« Un enfant à charge » est un enfant dont vous êtes responsable et dont vous vous occupez, qu'il soit votre enfant naturel ou non.`
  },
  inapte_travail: function () {
    return "Vous pouvez être « inapte au travail » après un accident ou une maladie. C'est le médecin du travail qui détermine cela."
  }
}

const Hint = {
  get: function(attribute, variation) {
    return attribute && texts[attribute] && texts[attribute](variation)
  }
}

export default Hint
