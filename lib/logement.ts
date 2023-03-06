import { getAnswer } from "./answers.js"
import { situationsMenageLayout } from "./types/situations.js"
import {
  LogementType,
  LocationType,
  StatutOccupationLogement,
} from "./enums/logement.js"

function getStatutOccupationLogement({
  _logementType,
  _locationType,
  _primoAccedant,
}: situationsMenageLayout) {
  let statutOccupationLogement = _logementType
  if (_logementType === LogementType.locataire) {
    if (_locationType === LocationType.vide) {
      statutOccupationLogement = StatutOccupationLogement.locataire_vide
    }
    if (_locationType === LocationType.meuble) {
      statutOccupationLogement = StatutOccupationLogement.locataire_meuble
    }
    if (_locationType === LocationType.foyer) {
      statutOccupationLogement = StatutOccupationLogement.locataire_foyer
    }
  }
  if (_logementType === LogementType.proprietaire) {
    if (_primoAccedant === true) {
      statutOccupationLogement = StatutOccupationLogement.primo_accedant
    }
  }
  if (_logementType === LogementType.heberge) {
    statutOccupationLogement = StatutOccupationLogement.loge_gratuitement
  }
  if (_logementType === LogementType.sansDomicile) {
    statutOccupationLogement = StatutOccupationLogement.sans_domicile
  }
  return statutOccupationLogement
}

function isOwner(_logementType) {
  return _logementType === LogementType.proprietaire
}

function captureCharges(_logementType, _locationType) {
  return (
    _logementType !== LogementType.proprietaire && (
      _locationType === LocationType.vide ||
      _locationType === LocationType.foyer
    )
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
      chargesQuestion: null
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
