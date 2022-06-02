<template>
  <form @submit.prevent="onSubmit">
    <label role="heading" aria-level="2" for="_firstName" class="aj-question"
      >Quel est le prénom de votre enfant ? Il servira uniquement à vous
      faciliter la saisie par la suite.</label
    >
    <input id="_firstName" v-model="value" type="text" />
    <ActionButtons :on-submit="onSubmit" :disableSubmit="!canSubmit(false)" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import { createIndividuMixin } from "@/mixins/individu-mixin"

export default {
  name: "SimulationIndividuFirstName",
  components: {
    ActionButtons,
  },
  mixins: [createIndividuMixin("_firstName")],
}
</script>
