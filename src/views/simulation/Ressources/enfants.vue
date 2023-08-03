<template>
  <form :data-testid="fieldName" @submit.prevent="next">
    <div v-for="enfant in enfants" :key="enfant.id" class="fr-form-group">
      <YesNoQuestion v-model="enfant._hasRessources">
        {{ $filters.capitalize(enfant._firstName) }} a-t-il/elle perçu des
        ressources
        <strong>depuis {{ store.dates.twelveMonthsAgo.label }}</strong
        > ?
      </YesNoQuestion>
    </div>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script lang="ts">
import ActionButtons from "@/components/action-buttons.vue"
import YesNoQuestion from "@/components/yes-no-question.vue"
import { nullifyUndefinedValue } from "@lib/answers.js"
import { useStore } from "@/stores/index.js"

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
    const enfants = this.store.situation.enfants.map((e) =>
      Object.assign({}, e)
    )
    return {
      fieldName: "_hasRessources",
      enfants,
    }
  },
  methods: {
    onSubmit() {
      this.store.answer({
        id: "enfants",
        entityName: "individu",
        fieldName: this.fieldName,
        path: this.$route.path,
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
