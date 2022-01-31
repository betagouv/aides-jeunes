<template>
  <form @submit.prevent="onSubmit">
    <InputDepCom
      v-model:codePostal="codePostal"
      v-model:nomCommune="nomCommune"
      v-model:matchingCommune="matchingCommune"
      codePostalLabel="Quel est votre code postal ?"
    />
    <WarningMessage v-if="warningMessage">{{ warningMessage }}</WarningMessage>
    <ActionButtons :on-submit="onSubmit" :disableSubmit="!canSubmit(false)" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import InputDepCom from "@/components/input-depcom"
import WarningMessage from "@/components/warning-message"

import { getAnswer } from "../../../../lib/answers"
import { createDepcomMixin } from "../../../mixins/depcom-mixin"

export default {
  name: "SimulationMenageDepcom",
  components: {
    ActionButtons,
    InputDepCom,
    WarningMessage,
  },
  mixins: [createDepcomMixin()],
  data: function () {
    const answer = getAnswer(
      this.$store.state.simulation.answers.all,
      "menage",
      "depcom"
    )
    return {
      codePostal: answer ? answer._codePostal : undefined,
      nomCommune: answer ? answer._nomCommune : undefined,
      matchingCommune: undefined,
    }
  },
  methods: {
    onSubmit: function () {
      if (this.canSubmit(true)) {
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
        this.$push()
      }
    },
  },
}
</script>
