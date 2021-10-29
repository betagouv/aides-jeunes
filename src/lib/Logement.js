function getStatutOccupationLogement(logement) {
  let statusOccupationMap = {
    proprietaireprimoaccedant: "primo_accedant",
    proprietaire: "proprietaire",
    locatairenonmeuble: "locataire_vide",
    locatairemeublehotel: "locataire_meuble",
    heberge: "loge_gratuitement",
    locatairefoyer: "locataire_foyer",
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
  let baseLogementMap = {
    primo_accedant: { type: "proprietaire", primoAccedant: true },
    proprietaire: { type: "proprietaire", primoAccedant: false },
    locataire_vide: { type: "locataire", locationType: "nonmeuble" },
    locataire_meuble: { type: "locataire", locationType: "meublehotel" },
    loge_gratuitement: { type: "heberge" },
    locataire_foyer: { type: "locataire", locationType: "foyer" },
    sans_domicile: { type: "sansDomicile" },
  }
  let base = statusOccupationId && baseLogementMap[statusOccupationId]
  return { type: null, primoAccedant: null, locationType: null, ...base }
}

const STATUT_OCCUPATION_LABEL = {
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

function getLoyerData(getAnswer) {
  const logementStatut = getAnswer("menage", "statut_occupation_logement")
  const coloc = getAnswer("menage", "coloc")
  const loyer = getAnswer("menage", "loyer")
  const chargesLocatives = getAnswer("menage", "charges_locatives")

  const isLocataire = !Logement.isOwner(logementStatut)
  const captureCharges = Logement.captureCharges(logementStatut)

  if (isLocataire) {
    const loyerLabel = `Quel est le montant${
      captureCharges ? "" : ", charges comprises,"
    } de votre ${coloc ? "part du " : ""}loyer`
    return {
      captureCharges,
      loyerQuestion: {
        label: loyerLabel,
        selectedValue: loyer,
        hint: "Sans déduire vos aides au logement si vous en avez.",
      },
      chargesQuestion: {
        label: "Quel est le montant de vos charges locatives ?",
        selectedValue: chargesLocatives,
        hint: "Cela peut inclure l'eau froide, le chauffage collectif, l'entretien des parties communes…",
      },
    }
  } else {
    return {
      captureCharges,
      loyerQuestion: {
        label: "Quelles sont vos mensualités ?",
        hint: "Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.",
        selectedValue: loyer,
      },
    }
  }
}

const Logement = {
  getLogementVariables,
  getStatutOccupationLogement,
  getStatutOccupationLabel,
  isOwner,
  captureCharges,
  getLoyerData,
}

export default Logement
