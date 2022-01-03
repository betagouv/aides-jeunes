<template>
  <form @submit.prevent="next">
    <YesNoQuestion
      v-for="enfant in enfants"
      :key="enfant.id"
      v-model="enfant._hasRessources"
      class="form__group"
    >
      {{ $filters.capitalize(enfant._firstName) }} a-t-il/elle perçu des
      ressources
      <strong>depuis {{ $store.state.dates.twelveMonthsAgo.label }}</strong
      > ?
    </YesNoQuestion>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import YesNoQuestion from "@/components/yes-no-question"

export default {
  name: "RessourcesTypes",
  components: {
    YesNoQuestion,
    ActionButtons,
  },
  data: function () {
    let enfants = this.$store.getters.situation.enfants.map((e) =>
      Object.assign({}, e)
    )
    return {
      enfants,
    }
  },
  methods: {
    onSubmit: function () {
      this.$store.dispatch("answer", {
        id: "enfants",
        entityName: "individu",
        fieldName: "_hasRessources",
        value: this.enfants.map((enfant) => ({
          id: enfant.id,
          value: enfant._hasRessources,
        })),
      })
      this.$push()
    },
  },
}
</script>
