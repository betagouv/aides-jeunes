const Scolarite = {
  types: [
    {
      value: "college",
      label: "Au collège",
    },
    {
      value: "lycee",
      label: "Au lycée / En CAP / En CPA",
    },
    {
      value: "enseignement_superieur",
      label: "Dans l'enseignement supérieur",
    },
    {
      value: "grande_ecole_du_numerique",
      label: "Dans une grande école du numérique",
    },
    {
      value: "inconnue",
      label: "Autre",
    },
  ],
  mentionsBaccalaureat: [
    {
      label: "Mention assez bien",
      value: "mention_assez_bien",
    },
    {
      label: "Mention bien",
      value: "mention_bien",
    },
    {
      label: "Mention très bien",
      value: "mention_tres_bien",
    },
    {
      label: "Mention très bien avec félicitations du jury",
      value: "mention_tres_bien_felicitations_jury",
    },
    {
      label: "Autre",
      value: "non_renseignee",
    },
  ],
  // https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006526701
  domainesFormation: {
    specialites_plurivalentes_sanitaires_et_sociales: {
      label: "Sanitaire et social",
      value: "specialites_plurivalentes_sanitaires_et_sociales",
      level: "100",
    },
    genie_civil_construction_bois: {
      label: "Génie civil, construction, bois",
      value: "genie_civil_construction_bois",
      level: "17",
    },
    autre: {
      label: "Autre",
      value: "autre",
    },
  },
}

module.exports = Scolarite
