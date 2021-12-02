<template>
  <form @submit.prevent="onSubmit">
    <div class="field-group">
      <label for="cp" class="aj-question"
        >Quel est votre code postal&nbsp;?
        <EnSavoirPlus />
      </label>
      <input id="cp" v-model="codePostal" type="text" data-type="number" pattern="[0-9]*" />
    </div>

    <p v-if="retrievingCommunes">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" />
    </p>
    <div v-show="communes && communes.length" class="field-group">
      <label for="commune" class="aj-question"
        >Veuillez sélectionner la ville qui correspond
      </label>
      <select id="commune" v-model="nomCommune">
        <option
          v-for="(commune, index) in communes"
          :key="`commune_${index}`"
          :value="commune.nom"
        >
          {{ commune.nom }}
        </option>
      </select>
    </div>
    <WarningMessage v-if="warningMessage" :text="warningMessage" />
    <Actions :on-submit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import WarningMessage from "@/components/WarningMessage"
import EnSavoirPlus from "@/components/EnSavoirPlus"
import Warning from "@/lib/Warnings"

import DepcomMixin from "@/mixins/DepcomMixin"
import { getAnswer } from "../../../../lib/answers"

export default {
  name: "SimulationMenageDepcom",
  components: {
    Actions,
    WarningMessage,
    EnSavoirPlus
  },
  mixins: [DepcomMixin],
  data: function () {
    const answer = getAnswer(this.$store.state.answers.all, "menage", "depcom")
    return {
      retrievingCommunes: false,
      codePostal: answer ? answer._codePostal : undefined,
      nomCommune: answer ? answer._nomCommune : undefined,
      communes: []
    }
  },
  computed: {
    warningMessage() {
      return Warning.get("aj_not_reliable", this.codePostal)
    },
  },
  watch: {
    codePostal: function (cp) {
      if (cp && cp.length == 5) {
        this.fetchCommune()
      }
    },
  },
  methods: {
    onSubmit: function () {
      if (!this.nomCommune || !this.codePostal) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      if (!this.codePostal.toString().match(/^(?:[0-8]\d|9[0-8])\d{3}$/)) {
        this.$store.dispatch(
          "updateError",
          "Le code postal est invalide. Le simulateur accepte uniquement les codes postaux français pour le moment."
        )
        return
      }
      const matchingCommune = this.communes.find(
        (c) => c.nom == this.nomCommune
      )
      if (matchingCommune) {
        this.$store.dispatch("answer", {
          entityName: "menage",
          fieldName: "depcom",
          value: {
            depcom: matchingCommune.code,
            _codePostal: this.codePostal.toString(),
            _nomCommune: this.nomCommune,
            _departement: matchingCommune.departement,
            _region: matchingCommune.region,
            _epci: matchingCommune.epci,
            _epciType: matchingCommune.epciType,
          },
        })
      }
      this.$push()
    },
  
  }
}
</script>

<style scoped lang="scss">
.field-group {
  margin-bottom: 2em;
}
</style>
