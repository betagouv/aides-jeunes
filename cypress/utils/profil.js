import { fillRadio, submit } from "./form"

const fillPrenom = (prenom) => {
  cy.get("label").invoke("text").should("contain", "prénom")
  if (prenom) {
    cy.get("#date_naissance").type(prenom)
  }
  submit()
}

const fillBirthDate = (birthDate) => {
  cy.url().should("include", "date_naissance")
  cy.get("#date_naissance").type(birthDate)
  submit()
}

const fillNationality = (nationality) => {
  fillRadio("nationalite", nationality)
}

const fillActivity = (activity) => {
  fillRadio("activite", activity)
}

const fillStudentLevelType = (level) => {
  fillRadio("scolarite", level)
}

const fillStudentLevel = (level) => {
  fillRadio("annee_etude", level)
}

const fillSchoolType = (type) => {
  fillRadio("statuts_etablissement_scolaire", type)
}

const fillAlternant = (alternant) => {
  fillRadio("alternant", alternant)
}

const fillContractDate = (numberOfMonth) => {
  fillRadio("_nombreMoisDebutContratDeTravail", numberOfMonth)
}

const fillIncapacityRate = (rate) => {
  fillRadio("taux_incapacite", rate)
}

const fillAAH = (aah) => {
  fillRadio("aah_restriction_substantielle_durable_acces_emploi", aah)
}

const fillHandicap = (handicap) => {
  fillRadio("handicap", handicap ? "true" : "false")
  if (handicap) {
    fillIncapacityRate(handicap.taux_incapacite)
    if (
      !handicap.taux_incapacite ||
      (0.5 < handicap.taux_incapacite && handicap.taux_incapacite <= 0.8)
    ) {
      fillAAH(handicap.aah)
    }
  }
}

const fillDeclarationParent = (isOnParentDeclaration) => {
  fillRadio("enfant_a_charge", isOnParentDeclaration)
}

const fillKeepStudying = (keepStudying) => {
  fillRadio("_continuite_etudes", keepStudying)
}

const fillSecuriteSociale = (regime) => {
  fillRadio("regime_securite_sociale", regime)
}

const fillPregnant = (pregnant) => {
  fillRadio("enceinte", pregnant)
}

const fillSharedCustory = (sharedCustody) => {
  fillRadio("garde_alternee", sharedCustody)
}

const fillMaritalStatus = (maritalStatus) => {
  fillRadio("statut_marital", maritalStatus)
}

const fillConjointActivity = (activity) => {
  cy.get("legend").invoke("text").should("contain", "est-il/elle")
  cy.get("label").invoke("text").should("contain", "Salarié")
  cy.get('input[type="radio"]').check(activity)
  submit()
}

const defaultIndivu = () => {
  fillBirthDate("12121980")
  fillNationality("FR")
  fillActivity("salarie")
  fillContractDate(2)
  fillHandicap(false)
  fillPregnant(false)
}

const handicaped = () => {
  fillBirthDate("12121980")
  fillNationality("FR")
  fillActivity("salarie")
  fillContractDate(2)
  fillHandicap({ taux_incapacite: 0.65, aah: true })
  fillPregnant(false)
}

const etudiantPublic = () => {
  fillBirthDate("12122000")
  fillNationality("FR")
  fillActivity("etudiant")
  fillStudentLevelType("enseignement_superieur")
  fillStudentLevel("master_1")
  fillSchoolType("public")
  fillAlternant(false)
  fillHandicap(false)
  fillDeclarationParent(false)
  fillKeepStudying(true)
  fillSecuriteSociale("regime_general")
  fillPregnant(false)
}

const defaultChildren = () => {
  fillPrenom()
  fillBirthDate("12122000")
  fillNationality("FR")
  fillSharedCustory(true)
  fillHandicap(false)
  fillStudentLevelType("college")
  fillDeclarationParent(false)
}

const defaultConjoint = () => {
  fillBirthDate("12121980")
  fillNationality("FR")
  fillMaritalStatus("marie")
  fillConjointActivity("salarie")
  fillHandicap(false)
  fillPregnant(false)
}

export default {
  handicaped,
  defaultIndivu,
  etudiantPublic,
  defaultChildren,
  defaultConjoint,
}
