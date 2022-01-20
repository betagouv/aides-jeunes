const texts = {
  activite: () => {
    return "Lorsque vous êtes étudiant·e salarié·e, vous devez sélectionner « Étudiant·e en formation ou alternance »."
  },
  bourse_criteres_sociaux_base_ressources_parentale: () => {
    return "Lorsque les parents sont séparés, il faut prendre les ressources du parent ayant à la charge l'étudiant. Si l'étudiant est en garde alternée, il faut faire la somme des ressources des deux foyers fiscaux des parents séparés."
  },
  depcom: () => {
    return "Le simulateur n'accepte que les codes postaux français. Si vous vivez à l'étranger, ce simulateur n'est pas encore adapté à votre situation."
  },
  enfants: function () {
    return `« Un enfant à charge » est un enfant dont vous êtes responsable et dont vous vous occupez, qu'il soit votre enfant naturel ou non.`
  },
  handicap: function (variation) {
    if (variation?.includes("enfant")) {
      return `Votre enfant est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
    } else if (variation?.includes("conjoint")) {
      return `Votre conjoint est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
    } else {
      return `Vous êtes « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci vous a reconnu comme tel·le et qu'elle vous a également attribué un « taux d'incapacité » lié à votre handicap.`
    }
  },
  inapte_travail: function () {
    return "Vous pouvez être « inapte au travail » après un accident ou une maladie. C'est le médecin du travail qui détermine cela."
  },
  scolarite: () => {
    return "Pour les étudiants en classes préparatoires aux grandes écoles, il faut sélectionner « Dans un établissement de l'enseignement supérieur »."
  },
}

const Hint = {
  get: function (attribute, variation) {
    return texts[attribute]?.(variation)
  },
}

export default Hint
