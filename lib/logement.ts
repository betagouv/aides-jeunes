import { getAnswer } from "./answers.js"
import { SituationMenage } from "./types/situations.js"
import {
  LogementCategory,
  LocationCategory,
  StatutOccupationLogement,
} from "./enums/logement.js"

function getStatutOccupationLogement({
  _logementType,
  _locationType,
  _primoAccedant,
}: SituationMenage) {
  let statutOccupationLogement = _logementType
  if (_logementType === LogementCategory.Locataire) {
    if (_locationType === LocationCategory.Vide) {
      statutOccupationLogement = StatutOccupationLogement.LocataireVide
    }
    if (_locationType === LocationCategory.Meuble) {
      statutOccupationLogement = StatutOccupationLogement.LocataireMeuble
    }
    if (_locationType === LocationCategory.Foyer) {
      statutOccupationLogement = StatutOccupationLogement.LocataireFoyer
    }
  }
  if (_logementType === LogementCategory.Proprietaire) {
    if (_primoAccedant === true) {
      statutOccupationLogement = StatutOccupationLogement.PrimoAccedant
    }
  }
  if (_logementType === LogementCategory.Heberge) {
    statutOccupationLogement = StatutOccupationLogement.LogeGratuitement
  }
  if (_logementType === LogementCategory.SansDomicile) {
    statutOccupationLogement = StatutOccupationLogement.SansDomicile
  }
  return statutOccupationLogement
}

function isOwner(_logementType) {
  return _logementType === LogementCategory.Proprietaire
}

function captureCharges(_logementType, _locationType) {
  return (
    _logementType !== LogementCategory.Proprietaire &&
    [LocationCategory.Vide, LocationCategory.Foyer].includes(_locationType)
  )
}

export function getLoyerData(answers) {
  const _logementType = getAnswer(answers, "menage", "_logementType")
  const _locationType = getAnswer(answers, "menage", "_locationType")
  const coloc = getAnswer(answers, "menage", "coloc")
  const loyer = getAnswer(answers, "menage", "loyer") || {}
  const isOwner = Logement.isOwner(_logementType)
  const captureCharges = Logement.captureCharges(_logementType, _locationType)

  if (!isOwner) {
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
        label: "Quel est le montant de vos charges locatives ?",
        selectedValue: loyer.charges_locatives,
        hint: "Montant en euros, cela peut inclure l'eau froide, le chauffage collectif, l'entretien des parties communes…",
      },
    }
  } else {
    return {
      captureCharges,
      loyerQuestion: {
        label: "Quelles sont vos mensualités ?",
        hint: "Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.",
        selectedValue: loyer.loyer,
      },
      chargesQuestion: null,
    }
  }
}

const Logement = {
  getStatutOccupationLogement,
  isOwner,
  captureCharges,
  getLoyerData,
}

export default Logement
