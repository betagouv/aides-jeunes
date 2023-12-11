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

// Used for prefill "FSL énergie du Var"
const ActiviteLabelMapping: Record<Activite, string> = {
  [Activite.Apprenti]: "En contrat d’apprentissage",
  [Activite.Autre]: "Autre",
  [Activite.BeneficiaireRsa]: "Bénéficiaire rsa",
  [Activite.Chomeur]: "En recherche d’emploi",
  [Activite.Etudiant]: "En études",
  [Activite.Inactif]: "En situation d’inactivité",
  [Activite.Independant]: "Indépendant(e)",
  [Activite.Professionnalisation]:
    "Contrat de professionnalisation en alternance",
  [Activite.Retraite]: "Retraité(e)",
  [Activite.Salarie]: "Salarié(e)",
  [Activite.SituationHandicap]: "En situation de handicap",
  [Activite.Stagiaire]: "Stagiaire",
}

export function getActiviteLabel(activite: Activite): string {
  const activiteLabel = ActiviteLabelMapping[activite]
  if (!activiteLabel) {
    throw new Error(`Activite ${activite} not found`)
  }
  return activiteLabel
}
