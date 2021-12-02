<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend>
        <h2 class="aj-question"> Vivez-vous seul·e ou en couple ? </h2>
      </legend>
      <div class="aj-selection-wrapper">
        <input
          id="seul"
          v-model="value"
          type="radio"
          :value="false"
          name="en_couple"
        />
        <label for="seul">Je vis seul·e</label>
      </div>
      <div class="aj-selection-wrapper">
        <input
          id="en-couple"
          v-model="value"
          type="radio"
          :value="true"
          name="en_couple"
        />
        <label for="en-couple">Je vis en couple</label>
      </div>
    </fieldset>
    <Actions :on-submit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"

export default {
  name: "SimulationFamilleEnCouple",
  components: {
    Actions,
  },
  data: function () {
    const value = this.$store.getters.getAnswer(
      "famille",
      "famille",
      "en_couple"
    )
    return { value }
  },
  methods: {
    onSubmit() {
      if (this.value === undefined) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }

      this.$store.dispatch("answer", {
        id: "famille",
        entityName: "famille",
        fieldName: "en_couple",
        value: this.value,
      })
      this.$push()
    },
  },
}
</script>
