import { CTALabel } from "./cta.js"

// Notez que toutes les clés sont maintenant en français,
// mais pour la continuité sur Matomo nous gardons les valeurs anglaises
export enum EventCategory {
  Defaut = "defaultCategory",
  General = "General",
  Parcours = "Parcours",
  Accompagnement = "Accompaniment",
  MontantAttendu = "Montant attendu",
  Followup = "Followup",
  Contact = "Contact",
  Tracer = "Tracer",
  Axe = "Axe",
  PNDS = "PNDS",
  JeDonneMonAvis = "Je donne mon avis",
  Home = "Home",
  Partenaire = "Partenaire",
  Redirection = "Redirection",
}

export enum EventAction {
  AccesSimulationAnonymisee = "Accès simulation anonymisée",
  AfficheLienAccompagnement = "show-accompaniment-link",
  BoutonPrecedent = "Bouton précédent",
  CalculResultatsRestauration = "compute",
  ClickLienAccompagnement = "click-accompaniment-link",
  Close = "close",
  CopieLien = "copy-link",
  CodePostalIntrouvable = "Depcom introuvable",
  Contact = "Contact",
  Email = "email",
  EnSavoirPlus = "En savoir plus",
  ErreurInitStore = "Error",
  ErreurSauvegardeSimulation = "Erreur sauvegarde simulation",
  Form = CTALabel.Form,
  FormulaireAffiche = "Formulaire affiché",
  FormulaireEmailInvalide = "Invalid email form",
  FormulaireTelephoneInvalide = "Invalid phone form",
  FormulaireValideAvecRecontact = "Formulaire validé avec recontact",
  Instructions = CTALabel.Instructions,
  Link = "link",
  LinkIneligible = "link-ineligible",
  Msa = "msa",
  NavigationAnnulee = "Navigation cancelled",
  Parcours = "Parcours",
  PartageLienEmail = "share-link-email",
  Redirection = "Redirection",
  ReprendreMaSimulation = "Reprendre ma simulation",
  RetourLogement = "retour-logement",
  SauvegardeDonnees = "Sauvegarde des données",
  Show = "show",
  ShowDetails = "showDetails",
  ShowLocations = "show-locations",
  ShowNewLocation = "show-new-location",
  ShowUnexpected = "show-unexpected",
  ShowUnexpectedAmountLink = "show-unexpected-amount-link",
  SimulationCaf = "simulation-caf",
  Teleservice = CTALabel.Teleservice,
  SiteInternet = "Site internet",
  Support = "Support",
  Telephone = "Téléphone",
  TelechargementDonnees = "Téléchargement données",
}
