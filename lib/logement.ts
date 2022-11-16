import { getAnswer } from "./answers"

export enum StatutOccupationLogement {
  primo_accedant = "primo_accedant",
  proprietaire = "proprietaire",
  locataire_vide = "locataire_vide",
  locataire_meuble = "locataire_meuble",
  loge_gratuitement = "loge_gratuitement",
  locataire_foyer = "locataire_foyer",
  sans_domicile = "sans_domicile",
}

function getLogementType(_logementType, _locationType, _primoAccedant) {
  if (_logementType === "locataire") {
    if (_locationType === "nonmeuble") {
      _logementType = "locataire_vide"
    }
    if (_locationType === "meublehotel") {
      _logementType = "locataire_meuble"
    }
    if (_locationType === "foyer") {
      _logementType = "locataire_foyer"
    }
  }
  if (_logementType === "proprietaire") {
    if (_primoAccedant === true) {
      _logementType = "primo_accedant"
    }
  }
  if (_logementType === "heberge") {
    _logementType = "loge_gratuitement"
  }
  if (_logementType === "sansDomicile") {
    _logementType = "sans_domicile"
  }
  return _logementType
}

function getLogementVariables(statusOccupationId) {
  const baseLogementMap = {
    primo_accedant: { type: "proprietaire", primoAccedant: true },
    proprietaire: { type: "proprietaire", primoAccedant: false },
    locataire_vide: { type: "locataire", locationType: "nonmeuble" },
    locataire_meuble: { type: "locataire", locationType: "meublehotel" },
    loge_gratuitement: { type: "heberge" },
    locataire_foyer: { type: "locataire", locationType: "foyer" },
    sans_domicile: { type: "sansDomicile" },
  }
  const base = statusOccupationId && baseLogementMap[statusOccupationId]
  return { type: null, primoAccedant: null, locationType: null, ...base }
}

export const STATUT_OCCUPATION_LABEL = {
  primo_accedant: "Propriétaire primo-accédant",
  proprietaire: "Propriétaire",
  locataire_vide: "Locataire",
  locataire_meuble: "Locataire de meublé ou hotel",
  loge_gratuitement: "Logé gratuitement",
  locataire_foyer: "Locataire foyer",
  sans_domicile: "Sans domicile stable",
}

function getStatutOccupationLabel(statut) {
  return STATUT_OCCUPATION_LABEL[statut]
}

function isOwner(logementStatut) {
  return (
    logementStatut === "proprietaire" || logementStatut === "primo_accedant"
  )
}

function captureCharges(logementStatut) {
  return !(
    Logement.isOwner(logementStatut) || logementStatut === "locataire_meuble"
  )
}

export function getLoyerData(answers) {
  const logementStatut = getAnswer(
    answers,
    "menage",
    "statut_occupation_logement"
  )
  const coloc = getAnswer(answers, "menage", "coloc")
  const loyer = getAnswer(answers, "menage", "loyer") || {}

  const isLocataire = !Logement.isOwner(logementStatut)
  const captureCharges = Logement.captureCharges(logementStatut)

  if (isLocataire) {
    const loyerLabel = `Quel est le montant de votre ${
      coloc ? "part du " : ""
    }loyer ${
      captureCharges ? "(charges non comprises)" : "(charges comprises)"
    } ?`
    return {
      captureCharges,
      loyerQuestion: {
        label: loyerLabel,
        selectedValue: loyer.loyer,
        hint: "Sans déduire vos aides au logement si vous en avez.",
      },
      chargesQuestion: {
        label: "Quel est le montant de vos charges locatives ?",
        selectedValue: loyer.charges_locatives,
        hint: "Cela peut inclure l'eau froide, le chauffage collectif, l'entretien des parties communes…",
      },
    }
  } else {
    return {
      captureCharges,
      loyerQuestion: {
        label: "Quelles sont vos mensualités ?",
        hint: "Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.",
        selectedValue: loyer.loyer,
      },
    }
  }
}

const Logement = {
  getLogementVariables,
  getLogementType,
  getStatutOccupationLabel,
  isOwner,
  captureCharges,
  getLoyerData,
  STATUT_OCCUPATION_LABEL,
}

export default Logement
