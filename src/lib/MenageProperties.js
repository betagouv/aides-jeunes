const loadEntity = (component) => {
  const menage = { ...(component.$store.getters.getMenage || {}) }
  return menage
}

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
}

export default {
  loadEntity,
  STEPS,
}
