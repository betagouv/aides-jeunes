<template>
  <form @submit.prevent="next">
    <YesNoQuestion
      v-for="enfant in enfants"
      :key="enfant.id"
      v-model="enfant._hasRessources"
      class="form__group"
    >
      {{ enfant._firstName | capitalize }} a-t-il/elle perçu des ressources
      <strong>depuis {{ $store.state.dates.twelveMonthsAgo.label }}</strong> ?
    </YesNoQuestion>
    <Actions :on-submit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"

export default {
  name: "RessourcesTypes",
  components: {
    YesNoQuestion,
    Actions,
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
