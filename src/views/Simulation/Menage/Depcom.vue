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
import { getAnswer } from "../../../../lib/answers"

export default {
  name: "SimulationMenageDepcom",
  mixins: [DepcomMixin],
  components: {
    Actions,
    WarningMessage,
    EnSavoirPlus,
  },
  data: function () {
    const answer = getAnswer(this.$store.state.answers.all, "menage", "depcom")
    return {
      retrievingCommunes: false,
      codePostal: answer ? answer._codePostal : undefined,
      nomCommune: answer ? answer._nomCommune : undefined,
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
          },
        })
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
