<template>
  <form @submit.prevent="onSubmit">
    <InputDepCom
      v-model:code-postal="codePostal"
      v-model:nom-commune="nomCommune"
      v-model:matching-commune="matchingCommune"
      :code-postal-label="question"
    />
    <WarningMessage v-if="warningMessage">{{ warningMessage }}</WarningMessage>
    <ActionButtons :on-submit="onSubmit" :disable-submit="!canSubmit(false)" />
  </form>
</template>

<script lang="ts">
import ActionButtons from "@/components/action-buttons.vue"
import InputDepCom from "@/components/input-depcom.vue"
import WarningMessage from "@/components/warning-message.vue"

import { getAnswer } from "@lib/answers.js"
import DepcomProperties from "@lib/properties/depcom-properties"
import Warning from "@/lib/warnings.js"
import { useStore } from "@/stores/index.js"

export default {
  name: "SimulationDepcomStep",
  components: {
    ActionButtons,
    InputDepCom,
    WarningMessage,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
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
    const answer = getAnswer(
      this.store.simulation.answers.all,
      entityName,
      fieldName,
      id,
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
        if (submit) {
          this.store.updateError("Ce champ est obligatoire.")
        }
        return false
      }
      return Boolean(this.matchingCommune)
    },
    onSubmit() {
      if (this.canSubmit(true)) {
        this.store.answer({
          id: this.id,
          entityName: this.entityName,
          fieldName: this.fieldName,
          path: this.$route.path,
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
