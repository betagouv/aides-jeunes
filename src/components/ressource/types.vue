<template>
  <form>
    <div>
      <p>
        Sélectionnez les types de ressources perçues
        <strong>
          <span v-if="individu._role === 'conjoint'"
            >par votre conjoint(e)</span
          >
          <span v-else-if="individu._role !== 'demandeur'"
            >par {{ individu._firstName }}</span
          >
          depuis {{ store.dates.twelveMonthsAgo.label }}</strong
        >. Vous pourrez ensuite saisir les montants.
      </p>
      <div
        v-for="category in categories"
        :key="category.id"
        class="form__group"
      >
        <h2 class="aj-question">
          {{ $filters.capitalize(category.label) }}
        </h2>
        <div class="aj-selections">
          <div
            v-for="type in sort(typesByCategories[category.id])"
            :key="type.id"
            class="aj-selection-wrapper"
          >
            <input
              :id="type.id"
              v-model="selectedTypes[type.id]"
              type="checkbox"
            />
            <label :for="type.id">
              {{ type.label }}
            </label>
          </div>
        </div>
      </div>
      <div class="form__group">
        {{ countLabel }}
      </div>
    </div>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons"
import { orderBy, groupBy } from "lodash-es"
import { ressourceCategories, ressourceTypes } from "@lib/resources"
import Ressource from "@lib/ressource"
import { getAnswer } from "@lib/answers"
import { useStore } from "@/stores"

export default {
  name: "RessourceTypes",
  components: {
    ActionButtons,
  },
  props: {
    individu: Object,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    let types = ressourceTypes.filter((ressourceType) => {
      return (
        Ressource.isRessourceOnMainScreen(ressourceType) &&
        Ressource.isRessourceRelevant(
          ressourceType,
          this.store.situation,
          this.individu
        )
      )
    })

    const selectedRessources = getAnswer(
      this.store.simulation.answers.all,
      "individu",
      "ressources",
      this.$route.params.id
    )
    const selectedTypes = {}
    types.forEach((type) => {
      selectedTypes[type.id] = selectedRessources?.includes(type.id)
    })
    return {
      categories: ressourceCategories,
      typesByCategories: groupBy(types, (t) => t.category),
      selectedTypes,
    }
  },
  computed: {
    countLabel() {
      const count = Object.keys(this.selectedTypes).filter(
        (selectType) => this.selectedTypes[selectType]
      ).length
      return `${count} ${
        count == 1 ? "ressource sélectionnée" : "ressources sélectionnées"
      }`
    },
  },
  watch: {
    individu() {
      this.selectedTypes = Ressource.getIndividuRessourceTypes(
        this.individu,
        this.store.situation
      )
    },
  },
  methods: {
    onSubmit() {
      this.store.answer({
        id: this.$route.params.id,
        entityName: "individu",
        fieldName: "ressources",
        value: Object.keys(this.selectedTypes).filter(
          (type) => this.selectedTypes[type]
        ),
      })
      this.$push()
    },
    sort(array) {
      return orderBy(array, ["positionInList", "label"])
    },
  },
}
</script>
