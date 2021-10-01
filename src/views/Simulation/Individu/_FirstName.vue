<template>
  <form @submit.prevent="onSubmit">
    <label for="_firstName" class="aj-question"
      >Quel est le prénom de votre enfant ? Il servira uniquement à vous
      faciliter la saisie par la suite.</label
    >
    <input type="text" id="_firstName" v-model="value" />
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuFirstName",
  components: {
    Actions,
  },
  mixins: [createIndividuMixin("_firstName")],
  methods: {
    onSubmit: function () {
      if (this.value.length) {
        this.$store.dispatch("answer", {
          id: this.$route.params.id,
          entityName: "individu",
          fieldName: this.fieldName,
          value: this.value,
        })
      }
      this.$push()
    },
  },
}
</script>
