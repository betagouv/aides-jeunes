const STEPS = {
  coloc: {
    question: "Est-ce une colocation ?",
  },

  logement_chambre: {
    question: `Est-ce une chambre ?
      <span class="help">
        Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
      </span>`,
  },

  participation_frais: {
    question: `Participez-vous aux frais du logement ?
      <span class="help"
        >Par exemple aux dépenses d'électricité, de téléphone, etc.</span
      >`,
  },

  _nombreMoisEntreeLogement: {
    question: "Prévoyez-vous d'emménager prochainement ?",
    questionType: "enum",
    items: (component) => {
      return [
        { value: "future", label: "Oui", active: true },
        {
          value: "recent",
          label: "Non, je l'ai fait il y a moins de 2 mois",
          active:
            component.$store.getters.situation.menage.statut_occupation_logement.startsWith(
              "locataire"
            ),
        },
        { value: "old", label: "Non", active: true },
      ].filter((item) => item.active)
    },
  },
}

export default {
  STEPS,
}
