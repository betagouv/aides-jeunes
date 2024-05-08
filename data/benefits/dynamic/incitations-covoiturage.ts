const DEFAULT_INCITATIONS_COVOITURAGE = {
  type: "bool",
  prefix: "l’",
  periodicite: "ponctuelle",
}

export const INCITATIONS_COVOITURAGE_BY_CODE: {
  [key: string]: {
    label: string
    link: string
    operateur: string
    institution?: string
    zone_sens_des_trajets: string
    conducteur_montant_max_par_mois?: number
    conducteur_montant_min_par_passager?: number
    conducteur_montant_max_par_passager?: number
    trajet_longueur_min: number
    trajet_longueur_max: number
    passager_trajets_max_par_mois: number
  }
} = {
  intercommunalite_metropole_lyon: {
    label: "de la Métropole de Lyon",
    link: "https://www.grandlyon.com/services/allocation-personnalisee-d-autonomie.html",
    operateur: "ponctuelle",
    zone_sens_des_trajets: "ET/OU",
    conducteur_montant_max_par_mois: 20,
    conducteur_montant_min_par_passager: 10,
    conducteur_montant_max_par_passager: 20,
    trajet_longueur_max: 10,
    trajet_longueur_min: 20,
    passager_trajets_max_par_mois: 10,
  },
}

function formatBenefit(institution: string) {
  const customizationBenefit = INCITATIONS_COVOITURAGE_BY_CODE[institution]
  return {
    id: `${institution.replace(/_/g, "-")}-incitations-covoiturage-eligibilite`,
    ...DEFAULT_INCITATIONS_COVOITURAGE,
    description:
      `Pour encourager le covoiturage ${customizationBenefit.label} subventionne tous vos trajets réservés depuis l’application, opérée par
    ${customizationBenefit.operateur}, que vous soyez conducteur ou passager.
    Gain pour le conducteur :
    ` +
      (!customizationBenefit.conducteur_montant_max_par_mois
        ? `jusqu'à ${customizationBenefit.conducteur_montant_max_par_mois} € par mois.`
        : `entre ${customizationBenefit.conducteur_montant_min_par_passager} € et ${customizationBenefit.conducteur_montant_max_par_passager} € par passager transporté.`) +
      `Coût des trajets pour le passager :
      bénéficiez de ${customizationBenefit.passager_trajets_max_par_mois}/30 trajets gratuits par jour.`,
    conditions: [
      `Télécharger l'application mobile, opérée par ${customizationBenefit.operateur}.`,
      `Réaliser votre trajet au départ ${customizationBenefit.zone_sens_des_trajets} à l’arrivée de ${customizationBenefit.label}.`,
      `Effectuer un trajet dont la distance est comprise entre ${customizationBenefit.trajet_longueur_min} et ${customizationBenefit.trajet_longueur_min} kilomètres.`,
    ],
    ...customizationBenefit,
    label: `Incitation au covoiturage ${customizationBenefit.label}`,
    institution,
    source: "javascript",
    conditions_generales: [
      {
        type: "attached_to_institution",
      },
    ],
  }
}

export function buildIncitationsCovoiturage() {
  return Object.keys(INCITATIONS_COVOITURAGE_BY_CODE).map((code) =>
    formatBenefit(code)
  )
}
