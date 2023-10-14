import { CTALabel } from "./cta.js"

export enum BehaviourEvent {
  Show = "show",
  ShowDetails = "showDetails",
  Form = CTALabel.Form,
  Instructions = CTALabel.Instructions,
  Link = "link",
  Msa = "msa",
  ShowLocations = "show-locations",
  ShowNewLocation = "show-new-location",
  Teleservice = CTALabel.Teleservice,
  ShowUnexpected = "show-unexpected",
  Close = "close",
  RetourLogement = "retour-logement",
  SimulationCaf = "simulation-caf",
  Email = "email",
  ShowUnexpectedAmountLink = "show-unexpected-amount-link",
}
