import { fillRadio, submit } from "./form.js"
import {
  GroupeSpecialite,
  MentionBaccalaureat,
  ScolariteEnfant,
} from "../../lib/enums/scolarite.ts"
import { urlInclude } from "./controllers.js"

const fill_first_name = (prenom) => {
  cy.get("[data-testid='question']").invoke("text").should("contain", "prénom")
  cy.checkA11y()
  // Verify if submit is blocked to avoid empty value
  cy.get('[data-testid="_firstName"]').clear()
  submit()
  cy.get("legend").invoke("text").should("contain", "prénom")

  if (prenom) {
    cy.get(`[data-testid="_firstName"]`).type(prenom)
  } else {
    cy.get('[data-testid="_firstName"]').type("John")
  }
  submit()
}

const fill_date_naissance = (birthDate) => {
  urlInclude("date_naissance")
  cy.checkA11y()
  cy.get("[data-testid='warning-message']").should("not.exist") // check openfisca missing benefits
  submit()
  urlInclude("date_naissance") // Stay on the same page as an answer is required
  cy.get("[data-testid='date_naissance']").type(birthDate)
  submit()
}

const fill_nationalite = (nationality) => {
  fillRadio("nationalite", nationality)
}

const fill_activite = (activity) => {
  fillRadio("activite", activity)
}

const fill_agence_travail_temporaire = (agence_travail_temporaire) => {
  fillRadio("agence_travail_temporaire", agence_travail_temporaire)
}

const fill_service_civique = (service_civique) => {
  fillRadio("service_civique", service_civique)
}

const fill_scolarite = (level) => {
  fillRadio("scolarite", level)
}

const fill_annee_etude = (level) => {
  fillRadio("annee_etude", level)
}

const fill_mention_baccalaureat = (mention) => {
  fillRadio("mention_baccalaureat", mention)
}

const fill_statuts_etablissement_scolaire = (type) => {
  fillRadio("statuts_etablissement_scolaire", type)
}

const fill_stagiaire = (stagiaire) => {
  fillRadio("stagiaire", stagiaire)
}

const fill_groupe_specialites_formation = (groupe_specialites_formation) => {
  fillRadio("groupe_specialites_formation", groupe_specialites_formation)
}

const fill_alternant = (alternant) => {
  fillRadio("alternant", alternant)
}

const fill__nombreMoisDebutContratDeTravail = (numberOfMonth) => {
  fillRadio("_nombreMoisDebutContratDeTravail", numberOfMonth)
}

const fill_taux_incapacite = (rate) => {
  fillRadio("taux_incapacite", rate)
}

const fill_aah_restriction_substantielle_durable_acces_emploi = (aah) => {
  fillRadio("aah_restriction_substantielle_durable_acces_emploi", aah)
}

const fillHandicap = (handicap) => {
  fillRadio("handicap", handicap ? "true" : "false")
  if (handicap) {
    fill_taux_incapacite(handicap.taux_incapacite)
    if (
      !handicap.taux_incapacite ||
      (0.5 <= handicap.taux_incapacite && handicap.taux_incapacite < 0.8)
    ) {
      fill_aah_restriction_substantielle_durable_acces_emploi(handicap.aah)
    }
  }
}

const fill_enfant_a_charge = (isOnParentDeclaration) => {
  fillRadio("enfant_a_charge", isOnParentDeclaration)
}

const fill_regime_securite_sociale = (regime) => {
  fillRadio("regime_securite_sociale", regime)
}

const fill_enceinte = (pregnant) => {
  fillRadio("enceinte", pregnant)
}

const fill_garde_alternee = (sharedCustody) => {
  fillRadio("garde_alternee", sharedCustody)
}

const fill_statut_marital = (maritalStatus) => {
  fillRadio("statut_marital", maritalStatus)
}

const fill_conjoint_activite = (activity) => {
  cy.checkA11y()
  cy.get("legend").invoke("text").should("contain", "est-il/elle")
  cy.get("label").invoke("text").should("contain", "Salarié")
  fill_activite(activity)
}

const defaultIndivu = () => {
  urlInclude("date_naissance")
  fill_date_naissance("12121980")
  fill_nationalite("FR")
  fill_activite("salarie")
  fill_agence_travail_temporaire(false)
  fill__nombreMoisDebutContratDeTravail(2)
  fillHandicap(false)
  fill_enceinte("pas_enceinte")
}

const handicaped = () => {
  fill_date_naissance("12121980")
  fill_nationalite("FR")
  fill_activite("salarie")
  fill_agence_travail_temporaire(true)
  fill__nombreMoisDebutContratDeTravail(2)
  fillHandicap({ taux_incapacite: 0.65, aah: true })
  fill_enceinte("pas_enceinte")
}

const publicStudent = () => {
  fill_date_naissance("12122000")
  fill_nationalite("FR")
  fill_activite("etudiant")
  fill_scolarite("enseignement_superieur")
  fill_annee_etude("licence_1")
  fill_statuts_etablissement_scolaire("public")
  fill_mention_baccalaureat(MentionBaccalaureat.MentionTresBien)
  fill_stagiaire(false)
  fill_alternant(false)
  fill_groupe_specialites_formation(GroupeSpecialite.Groupe330)
  fill_service_civique(true)
  fillHandicap(false)
  fill_enfant_a_charge(false)
  fill_regime_securite_sociale("regime_general")
  fill_enceinte("pas_enceinte")
}

const defaultChildren = () => {
  fill_first_name()
  fill_date_naissance("12122000")
  fill_nationalite("FR")
  fill_garde_alternee(true)
  fillHandicap(false)
  fill_scolarite("college")
  fill_enfant_a_charge(false)
}

const kindergartenChildren = () => {
  fill_first_name("Mika")
  fill_date_naissance("12122010")
  fill_nationalite("FR")
  fill_garde_alternee(true)
  fillHandicap(false)
  fill_scolarite(ScolariteEnfant.Maternelle)
  fill_enfant_a_charge(true)
}

const defaultConjoint = () => {
  fill_date_naissance("12121980")
  fill_nationalite("FR")
  fill_statut_marital("marie")
  fill_conjoint_activite("salarie")
  fillHandicap(false)
  fill_enceinte("pas_enceinte")
}

export default {
  handicaped,
  defaultIndivu,
  publicStudent,
  defaultChildren,
  kindergartenChildren,
  defaultConjoint,
}
