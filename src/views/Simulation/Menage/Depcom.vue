<template>
  <form @submit.prevent="onSubmit">
    <InputDepCom
      v-model:codePostal="codePostal"
      v-model:nomCommune="nomCommune"
      v-model:matchingCommune="matchingCommune"
      codePostalLabel="Quel est votre code postal ?"
    />
    <WarningMessage v-if="warningMessage" :text="warningMessage" />
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/ActionButtons"
import InputDepCom from "@/components/InputDepcom"
import WarningMessage from "@/components/WarningMessage"
import Warning from "@/lib/warnings"

import { getAnswer } from "../../../../lib/answers"

export default {
  name: "SimulationMenageDepcom",
  components: {
    ActionButtons,
    InputDepCom,
    WarningMessage,
  },
  data: function () {
    const answer = getAnswer(this.$store.state.answers.all, "menage", "depcom")
    return {
      codePostal: answer ? answer._codePostal : undefined,
      nomCommune: answer ? answer._nomCommune : undefined,
      matchingCommune: undefined,
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

      if (this.matchingCommune) {
        this.$store.dispatch("answer", {
          entityName: "menage",
          fieldName: "depcom",
          value: {
            depcom: this.matchingCommune.code,
            _codePostal: this.codePostal.toString(),
            _nomCommune: this.nomCommune,
            _departement: this.matchingCommune.departement,
            _region: this.matchingCommune.region,
            _epci: this.matchingCommune.epci,
            _epciType: this.matchingCommune.epciType,
          },
        })
      }
      this.$push()
    },
  },
}
</script>
