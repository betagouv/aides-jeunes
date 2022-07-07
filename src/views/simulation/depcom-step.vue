<template>
  <form @submit.prevent="onSubmit">
    <InputDepCom
      v-model:codePostal="codePostal"
      v-model:nomCommune="nomCommune"
      v-model:matchingCommune="matchingCommune"
      :codePostalLabel="question"
    />
    <WarningMessage v-if="warningMessage">{{ warningMessage }}</WarningMessage>
    <ActionButtons :on-submit="onSubmit" :disableSubmit="!canSubmit(false)" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons.vue"
import InputDepCom from "@/components/input-depcom.vue"
import WarningMessage from "@/components/warning-message.vue"

import * as answers from "@/../lib/answers"
import DepcomProperties from "@/../lib/properties/depcom-properties"
import Warning from "@/lib/warnings"

export default {
  name: "SimulationDepcomStep",
  components: {
    ActionButtons,
    InputDepCom,
    WarningMessage,
  },
  data: function () {
    const routeSplit = this.$route.path.split("/")
    const entityName = routeSplit[2]
    let id = undefined
    let fieldName
    if (entityName === "individu") {
      id = routeSplit[3]
      fieldName = routeSplit[4]
    } else {
      fieldName = routeSplit[3]
    }

    const question = DepcomProperties[fieldName].question
    const answer = answers.getAnswer(
      this.$store.state.simulation.answers.all,
      entityName,
      fieldName,
      id
    )
    return {
      entityName,
      id,
      fieldName,
      question,
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
    canSubmit(submit) {
      if (!this.nomCommune || !this.codePostal) {
        submit &&
          this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return false
      }
      return Boolean(this.matchingCommune)
    },
    onSubmit: function () {
      if (this.canSubmit(true)) {
        this.$store.dispatch("answer", {
          id: this.id,
          entityName: this.entityName,
          fieldName: this.fieldName,
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
