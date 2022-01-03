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
}

module.exports = Scolarite
