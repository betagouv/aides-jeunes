<template>
  <form @submit.prevent="next">
    <YesNoQuestion
      v-for="enfant in enfants"
      :key="enfant.id"
      v-model="enfant._hasRessources"
      class="form__group"
    >
      {{ $filters.capitalize(enfant._firstName) }} a-t-il/elle perçu des
      ressources <strong>depuis {{ store.dates.twelveMonthsAgo.label }}</strong
      > ?
    </YesNoQuestion>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons.vue"
import YesNoQuestion from "@/components/yes-no-question.vue"
import { nullifyUndefinedValue } from "@lib/answers"
import { useStore } from "@/stores"

export default {
  name: "RessourcesTypes",
  components: {
    YesNoQuestion,
    ActionButtons,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    let enfants = this.store.situation.enfants.map((e) => Object.assign({}, e))
    return {
      enfants,
    }
  },
  methods: {
    onSubmit() {
      this.store.answer({
        id: "enfants",
        entityName: "individu",
        fieldName: "_hasRessources",
        value: this.enfants.map((enfant) => ({
          id: enfant.id,
          value: nullifyUndefinedValue(enfant._hasRessources),
        })),
      })
      this.$push()
    },
  },
}
</script>
