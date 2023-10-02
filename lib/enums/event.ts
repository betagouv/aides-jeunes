// Notez que toutes les clés sont maintenant en français,
// mais pour la continuité sur Matomo nous gardons les valeurs anglaises
export enum EventCategory {
  Defaut = "defaultCategory",
  General = "General",
  Parcours = "Parcours",
  Accompagnement = "Accompaniment",
  MontantAttendu = "Montant attendu",
  Followup = "Followup",
}

export enum EventAction {
  AccesSimulationAnonymisee = "Accès simulation anonymisée",
  AfficheLienAccompagnement = "show-accompaniment-link",
  BoutonPrecedent = "Bouton précédent",
  CalculResultatsRestauration = "compute",
  CodePostalIntrouvable = "Depcom introuvable",
  EnSavoirPlus = "En savoir plus",
  ErreurInitStore = "Error",
  ErreurSauvegardeSimulation = "Erreur sauvegarde simulation",
  FormulaireAffiche = "Formulaire affiché",
  FormulaireEmailInvalide = "Invalid email form",
  FormulaireTelephoneInvalide = "Invalid phone form",
  FormulaireValideAvecRecontact = "Formulaire validé avec recontact",
  NavigationAnnulee = "Navigation cancelled",
  Redirection = "Redirection",
  SauvegardeDonnees = "Sauvegarde des données",
  TelechargementDonnees = "Téléchargement données",
}
