<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <label for="loyer" class="aj-question"
        >{{ loyerQuestion.label }}
        <span class="help">{{ loyerQuestion.hint }}</span>
      </label>
      <div class="aj-input-currency-wrapper">
        <input
          id="loyer"
          type="number"
          class="aj-input-euros"
          v-model="loyerQuestion.selectedValue"
        />
      </div>
    </fieldset>
    <fieldset v-if="captureCharges">
      <label for="charges" class="aj-question"
        >{{ chargesQuestion.label }}
        <span class="help">{{ chargesQuestion.hint }}</span>
      </label>
      <div class="aj-input-currency-wrapper">
        <input
          id="charges"
          type="number"
          v-model="chargesQuestion.selectedValue"
        />
      </div>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"

export default {
  name: "SimulationMenageDepCom",
  components: {
    Actions,
  },
  data: function () {
    const menage = { ...this.$store.getters.getMenage } || {}
    const logementStatut = this.$store.getters.getLogementStatut || ""
    const isLocataire = !(
      logementStatut === "proprietaire" || logementStatut === "primo_accedant"
    )
    const captureCharges = isLocataire && logementStatut != "locataire_meuble"

    if (isLocataire) {
      const loyerLabel =
        [
          "Quel est le montant",
          captureCharges ? null : ", charges comprises,",
          menage.coloc ? " de votre part du loyer" : " de votre loyer",
        ]
          .filter((present) => present)
          .join("") + " ?"
      return {
        menage: menage,
        captureCharges,
        loyerQuestion: {
          label: loyerLabel,
          selectedValue: menage.loyer,
          hint: "Sans déduire vos aides au logement si vous en avez.",
        },
        chargesQuestion: {
          label: "Quel est le montant de vos charges locatives ?",
          selectedValue: menage.charges_locatives,
          hint: "Cela peut inclure l'eau froide, le chauffage collectif, l'entretien des parties communes…",
        },
      }
    } else {
      return {
        menage: menage,
        loyerQuestion: {
          label: "Quelles sont vos mensualités ?",
          hint: "Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.",
          selectedValue: menage.loyer,
        },
      }
    }
  },
  methods: {
    onSubmit: function () {
      this.menage.loyer = this.loyerQuestion.selectedValue || 0
      if (this.captureCharges) {
        this.menage.charges_locatives = this.chargesQuestion.selectedValue || 0
      }
      this.$store.dispatch("updateMenage", this.menage)
      this.$push()
    },
  },
}
</script>

<style scoped lang="scss">
fieldset {
  margin-bottom: 2em;
}
</style>
