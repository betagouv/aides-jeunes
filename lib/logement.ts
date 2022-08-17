import { getAnswer } from "./answers.js"

function getStatutOccupationLogement(logement) {
  const statusOccupationMap = {
    heberge: "loge_gratuitement",
    locatairefoyer: "locataire_foyer",
    locatairemeublehotel: "locataire_meuble",
    locatairenonmeuble: "locataire_vide",
    proprietaire: "proprietaire",
    proprietaireprimoaccedant: "primo_accedant",
    sansDomicile: "sans_domicile",
  }
  let statusOccupationId = logement.type
  if (logement.type == "proprietaire" && logement.primoAccedant) {
    statusOccupationId = "proprietaireprimoaccedant"
  } else if (logement.type == "locataire" && logement.locationType) {
    statusOccupationId += logement.locationType
  }
  return statusOccupationMap[statusOccupationId]
}

function getLogementVariables(statusOccupationId) {
  const baseLogementMap = {
    locataire_foyer: { locationType: "foyer", type: "locataire" },
    locataire_meuble: { locationType: "meublehotel", type: "locataire" },
    locataire_vide: { locationType: "nonmeuble", type: "locataire" },
    loge_gratuitement: { type: "heberge" },
    primo_accedant: { primoAccedant: true, type: "proprietaire" },
    proprietaire: { primoAccedant: false, type: "proprietaire" },
    sans_domicile: { type: "sansDomicile" },
  }
  const base = statusOccupationId && baseLogementMap[statusOccupationId]
  return { locationType: null, primoAccedant: null, type: null, ...base }
}

export const STATUT_OCCUPATION_LABEL = {
  locataire_foyer: "Locataire foyer",
  locataire_meuble: "Locataire de meublé ou hotel",
  locataire_vide: "Locataire",
  loge_gratuitement: "Logé gratuitement",
  primo_accedant: "Propriétaire primo-accédant",
  proprietaire: "Propriétaire",
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
      chargesQuestion: {
        hint: "Cela peut inclure l'eau froide, le chauffage collectif, l'entretien des parties communes…",
        label: "Quel est le montant de vos charges locatives ?",
        selectedValue: loyer.charges_locatives,
      },
      loyerQuestion: {
        hint: "Sans déduire vos aides au logement si vous en avez.",
        label: loyerLabel,
        selectedValue: loyer.loyer,
      },
    }
  } else {
    return {
      captureCharges,
      loyerQuestion: {
        hint: "Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.",
        label: "Quelles sont vos mensualités ?",
        selectedValue: loyer.loyer,
      },
    }
  }
}

const Logement = {
  captureCharges,
  getLogementVariables,
  getLoyerData,
  getStatutOccupationLabel,
  getStatutOccupationLogement,
  isOwner,
  STATUT_OCCUPATION_LABEL,
}

export default Logement
