<template>
  <form @submit.prevent="onSubmit">
    <div class="field-group">
      <label for="cp" class="aj-question"
        >Quel est votre code postal&nbsp;?
        <EnSavoirPlus />
      </label>
      <input id="cp" type="number" v-model="codePostal" />
    </div>

    <p v-if="retrievingCommunes"
      ><i class="fa fa-spinner fa-spin" aria-hidden="true"></i
    ></p>
    <div class="field-group" v-show="communes && communes.length">
      <label for="commune" class="aj-question"
        >Veuillez sélectionner la ville qui correspond
      </label>
      <select v-model="nomCommune" id="commune">
        <option
          v-for="(commune, index) in communes"
          v-bind:value="commune.nom"
          v-bind:key="`commune_${index}`"
        >
          {{ commune.nom }}
        </option>
      </select>
    </div>
    <WarningMessage v-if="warningMessage" :text="warningMessage" />
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import WarningMessage from "@/components/WarningMessage"
import EnSavoirPlus from "@/components/EnSavoirPlus"
import Warning from "@/lib/Warnings"
import DepcomMixin from "@/mixins/DepcomMixin"

export default {
  name: "SimulationMenageDepcom",
  mixins: [DepcomMixin],
  components: {
    Actions,
    WarningMessage,
    EnSavoirPlus,
  },
  data: function () {
    const menage = { ...this.$store.getters.getMenage } || {}
    return {
      menage: menage,
      retrievingCommunes: false,
      codePostal: menage._codePostal,
      nomCommune: menage._nomCommune,
    }
  },
  computed: {
    warningMessage() {
      return Warning.get("aj_not_reliable", this.codePostal)
    },
  },
  methods: {
    onSubmit: function () {
      if (!this.nomCommune || !this.codePostal) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      if (!this.codePostal.match(/^(?:[0-8]\d|9[0-8])\d{3}$/)) {
        this.$store.dispatch("updateError", "Le code postal n'est pas valide.")
        return
      }
      const communeMatches = this.communes.filter(
        (c) => c.nom == this.nomCommune
      )
      if (communeMatches.length) {
        this.menage.depcom = communeMatches[0].code
        this.menage._codePostal = this.codePostal.toString()
        this.menage._nomCommune = this.nomCommune
        this.$store.dispatch("updateMenage", this.menage)
      }
      this.$push()
    },
  },
}
</script>

<style scoped lang="scss">
.field-group {
  margin-bottom: 2em;
}
</style>
