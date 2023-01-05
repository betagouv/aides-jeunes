import { getAnswer } from "./answers.js"
import { situationsMenageLayout } from "./types/situations.js"

export enum StatutOccupationLogement {
  primo_accedant = "primo_accedant",
  proprietaire = "proprietaire",
  locataire_vide = "locataire_vide",
  locataire_meuble = "locataire_meuble",
  loge_gratuitement = "loge_gratuitement",
  locataire_foyer = "locataire_foyer",
  sans_domicile = "sans_domicile",
}

function getStatutOccupationLogement({
  _logementType,
  _locationType,
  _primoAccedant,
}: situationsMenageLayout) {
  let statutOccupationLogement = _logementType
  if (_logementType === "locataire") {
    if (_locationType === "vide") {
      statutOccupationLogement = "locataire_vide"
    }
    if (_locationType === "meuble") {
      statutOccupationLogement = "locataire_meuble"
    }
    if (_locationType === "foyer") {
      statutOccupationLogement = "locataire_foyer"
    }
  }
  if (_logementType === "proprietaire") {
    if (_primoAccedant === true) {
      statutOccupationLogement = "primo_accedant"
    }
  }
  if (_logementType === "heberge") {
    statutOccupationLogement = "loge_gratuitement"
  }
  if (_logementType === "sansDomicile") {
    statutOccupationLogement = "sans_domicile"
  }
  return statutOccupationLogement
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

function isOwner(_logementType) {
  return _logementType === "proprietaire"
}

function captureCharges(_logementType, _locationType) {
  return !(Logement.isOwner(_logementType) || _locationType === "meuble")
}

export function getLoyerData(answers) {
  const _logementType = getAnswer(answers, "menage", "_logementType")
  const _locationType = getAnswer(answers, "menage", "_primoAccedant")
  const coloc = getAnswer(answers, "menage", "coloc")
  const loyer = getAnswer(answers, "menage", "loyer") || {}

  const isLocataire = !Logement.isOwner(_logementType)
  const captureCharges = Logement.captureCharges(_logementType, _locationType)

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
        hint: "Montant en euros, sans déduire vos aides au logement si vous en avez.",
      },
      chargesQuestion: {
        label: "Quel est le montant de vos charges locatives ?",
        selectedValue: loyer.charges_locatives,
        hint: "Montant en euros, cela peut inclure l'eau froide, le chauffage collectif, l'entretien des parties communes…",
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
  getStatutOccupationLogement,
  getStatutOccupationLabel,
  isOwner,
  captureCharges,
  getLoyerData,
  STATUT_OCCUPATION_LABEL,
}

export default Logement
