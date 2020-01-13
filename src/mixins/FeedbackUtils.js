
export default {
  computed: {
    montant: function() {
      const base = this.$store.state.calculs && this.$store.state.calculs.resultats && this.$store.state.calculs.resultats.droitsEligibles || []
      const benefit = base.filter((d) => d.id === this.droit.id).shift()
      return benefit && benefit.montant || 0
    },
    situation: function() { return this.$store.state.situation },
    emailSubject: function() { return `[${this.situation._id}] Montants inattendus` },
    emailBody: function() { return `
Bonjour,

En effectuant une simulation sur mes-aides.org, j'ai obtenu le résultat suivant :

- ${this.montant || 'XXX'} € / mois pour la prestation «  ».

Mais en effectuant la même simulation sur le site caf.fr j'obtiens le résultat suivant / la CAF a fini par m'attribuer le montant suivant :

- XXX € / mois pour la prestation « ${this.droit ? this.droit.label : 'XXX'} ».

Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.

Bonne journée,

————
ID : ${this.situation._id} (à conserver impérativement pour traitement de votre demande)
————
`
    }
  }
}
