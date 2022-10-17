<template>
  <div class="field-group">
    <label aria-level="2" class="aj-question" for="cp" role="heading"
      >{{ codePostalLabel }}
      <EnSavoirPlus />
    </label>
    <input
      id="cp"
      v-model="codePostalValue"
      data-testid="postalCode"
      data-type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      type="text"
    />
  </div>

  <p v-if="retrievingCommunes">
    <i aria-hidden="true" class="ri ri-loader-2-line ri-spin" />
  </p>
  <div v-show="communes?.length" class="field-group">
    <label class="aj-question" for="commune"
      >Veuillez sélectionner la ville qui correspond
    </label>
    <select id="commune" v-model="nomCommuneValue">
      <option
        v-for="(commune, index) in communes"
        :key="`commune_${index}`"
        :value="commune.nom"
      >
        {{ commune.nom }}
      </option>
    </select>
  </div>
</template>

<script>
import Commune from "../lib/commune"
import EnSavoirPlus from "@/components/en-savoir-plus.vue"
import { useStore } from "@/stores"

export default {
  name: "InputDepCom",
  components: {
    EnSavoirPlus,
  },
  props: {
    codePostal: String,
    codePostalLabel: String,
    nomCommune: String,
    matchingCommune: Object,
  },
  emits: ["update:nomCommune", "update:codePostal", "update:matchingCommune"],
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      codePostalValue: this.codePostal,
      nomCommuneValue: this.nomCommune,
      retrievingCommunes: false,
      communes: [],
    }
  },
  watch: {
    codePostalValue: function (cp) {
      this.nomCommuneValue = null
      this.communes = []
      if (cp?.length == 5) {
        this.$emit("update:codePostal", cp)
        this.fetchCommune()
      }
    },
    nomCommuneValue: function (commune) {
      this.$emit("update:nomCommune", commune)
      this.updateMatchingCommune()
    },
    communes: function (communesList) {
      if (communesList?.length) {
        this.updateMatchingCommune()
      }
    },
  },
  beforeMount() {
    if (this.codePostalValue?.length == 5) {
      this.fetchCommune()
    }
  },
  methods: {
    updateMatchingCommune() {
      this.$emit(
        "update:matchingCommune",
        this.communes.find((c) => c.nom == this.nomCommuneValue)
      )
    },
    async fetchCommune() {
      if (
        !this.codePostalValue ||
        this.codePostalValue.toString().length !== 5
      ) {
        return []
      }
      this.retrievingCommunes = true
      return Commune.get(this.codePostalValue)
        .then((communes) => {
          if (communes.length <= 0) {
            this.$matomo?.trackEvent(
              "General",
              "Depcom introuvable",
              `Code postal : ${this.codePostalValue}`
            )
            this.store.updateError(
              "Le code postal est invalide. Le simulateur accepte uniquement les codes postaux français pour le moment."
            )
            return []
          }
          this.store.updateError(null)
          if (!communes.map((c) => c.nom).includes(this.nomCommuneValue)) {
            this.nomCommuneValue = Commune.getMostPopulated(communes).nom
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
  },
}
</script>

<style lang="scss" scoped>
.field-group {
  margin-bottom: 2em;
}
</style>
