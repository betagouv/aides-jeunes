<template>
  <form @submit.prevent="onSubmit">
    <label for="date_entree_logement"
      ><h2 class="aj-question"
        >Depuis quand êtes-vous locataire de votre logement ?</h2
      ></label
    >
    <InputDate required id="date_entree_logement" v-model="value" />
    <p class="notification warning" v-if="$state.error">
      Ce champ est obligatoire.
    </p>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import InputDate from "@/components/InputDate"
import moment from "moment"

export default {
  name: "SimulationDateEntreeLogement",
  components: {
    Actions,
    InputDate,
  },
  data: function () {
    const menage = { ...(this.$store.getters.getMenage || {}) }
    return {
      menage: menage,
      date: menage.date_entree_logement,
    }
  },
  computed: {
    value: {
      get() {
        return this.date
          ? moment(this.date, "YYYY-MM-DD", true).toDate()
          : undefined
      },
      set: function (value) {
        this.date = moment(value).format("YYYY-MM-DD")
      },
    },
  },
  methods: {
    onSubmit() {
      if (this.value === undefined) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      this.menage.date_entree_logement = this.date
      this.$store.dispatch("updateMenage", this.menage)

      this.$push()
    },
  },
}
</script>
