import Commune from "../lib/Commune"

export default {
  asyncComputed: {
    communes: {
      get: function () {
        if (!this.codePostal || this.codePostal.toString().length !== 5) {
          return []
        }
        this.retrievingCommunes = true
        return Commune.get(this.codePostal)
          .then((communes) => {
            if (communes.length <= 0) {
              this.$matomo &&
                this.$matomo.trackEvent(
                  "General",
                  "Depcom introuvable",
                  `Code postal : ${this.codePostal}`
                )
            }
            if (!communes.map((c) => c.nom).includes(this.nomCommune)) {
              this.nomCommune = Commune.getMostPopulated(communes).nom
            }
            this.communes = communes
            return communes
          })
          .catch(() => {
            return []
          })
          .finally(() => {
            this.retrievingCommunes = false
          })
      },
      default: [],
    },
  },
  methods: {},
}
