
const Hint = {
  handicap: function() {
    return `Vous êtes « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
      et que celle-ci vous a reconnu comme tel.le et qu'elle vous a également attribué un « taux d'incapacité » lié à votre handicap.`
  },
  enfants: function() {
    return `« un enfant à charge » est un enfant dont vous êtes responsable et dont vous vous occupez, qu'il soit votre enfant naturel ou non.`
  },
  inapte_travail: function () {
    return 'Vous pouvez être "inapte au travail" après un accident ou une maladie par exemple : c\'est le médecin du travail qui détermine cela.'
  }
}

export default Hint
