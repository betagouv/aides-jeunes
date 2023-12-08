export enum Activite {
  Apprenti = "apprenti",
  Autre = "autre",
  BeneficiaireRsa = "beneficiaire_rsa",
  Chomeur = "chomeur",
  Etudiant = "etudiant",
  Inactif = "inactif",
  Independant = "independant",
  Professionnalisation = "professionnalisation",
  Retraite = "retraite",
  Salarie = "salarie",
  SituationHandicap = "situation_handicap",
  Stagiaire = "stagiaire",
}

export enum ActiviteLabel {
  Apprenti = "En contrat d’apprentissage",
  Autre = "Autre",
  BeneficiaireRsa = "Bénéficiaire rsa",
  Chomeur = "En recherche d’emploi",
  Etudiant = "En études",
  Inactif = "En situation d’inactivité",
  Independant = "Indépendant(e)",
  Professionnalisation = "Contrat de professionnalisation en alternance",
  Retraite = "Retraité(e)",
  Salarie = "Salarié(e)",
  ServiceCivique = "En service civique",
  SituationHandicap = "En situation de handicap",
  Stagiaire = "Stagiaire",
}

export function getActiviteLabelFromString(activite: string): any {
  const activiteLabelKey = Object.keys(Activite).find(
    (key) => Activite[key] === activite
  )
  if (!activiteLabelKey) throw new Error(`Activite ${activite} not found`)
  return ActiviteLabel[activiteLabelKey]
}
