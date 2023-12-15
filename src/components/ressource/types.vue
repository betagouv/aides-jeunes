<template>
  <form>
    <p>
      Sélectionnez les types de ressources perçues
      <strong>
        <span v-if="individu._role === 'conjoint'">par votre conjoint(e)</span>
        <span v-else-if="individu._role !== 'demandeur'"
          >par {{ individu._firstName }}</span
        >
        <span v-else-if="individu.enfant_a_charge[store.dates.thisYear.label]">
          par vos parents ou par vos tuteurs légaux
        </span>
        depuis {{ store.dates.twelveMonthsAgo.label }}</strong
      >. Vous pourrez ensuite saisir les montants.
      <EnSavoirPlus v-if="hasSeparatedParents" />
    </p>
    <fieldset
      v-for="category in categories"
      :key="category.id"
      class="fr-fieldset fr-mb-4w"
    >
      <legend class="fr-fieldset__legend fr-px-0">
        <span class="fr-text--lead fr-text--bold">
          {{ $filters.capitalize(category.label) }}
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div
          v-for="type in sort(typesByCategories[category.id])"
          :key="type.id"
          class="fr-checkbox-group"
        >
          <input
            :id="type.id"
            v-model="selectedTypes[type.id]"
            type="checkbox"
          />
          <label :for="type.id" class="fr-label">
            {{ type.label }}
          </label>
        </div>
      </div>
    </fieldset>
    <p class="fr-hint-text">
      {{ countLabel }}
    </p>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script lang="ts">
import ActionButtons from "@/components/action-buttons.vue"
import { ressourceCategories, ressourceTypes } from "@lib/resources.js"
import Ressource from "@lib/ressource.js"
import { getAnswer } from "@lib/answers.js"
import { useStore } from "@/stores/index.js"
import EnSavoirPlus from "@/components/en-savoir-plus.vue"

export default {
  name: "RessourceTypes",
  components: {
    ActionButtons,
    EnSavoirPlus,
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
      typesByCategories: this.groupTypes(types),
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
    hasSeparatedParents() {
      return this.store.situation?.parents?._situation === "separes"
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
        path: this.$route.path,
        value: Object.keys(this.selectedTypes).filter(
          (type) => this.selectedTypes[type]
        ),
      })
      this.$push()
    },
    sort(array) {
      return array.sort(
        (a, b) =>
          (a.positionInList || Infinity) - (b.positionInList || Infinity) ||
          a.label.localeCompare(b.label)
      )
    },
    groupTypes(types) {
      return types.reduce((categories, type) => {
        if (!categories[type.category]) {
          categories[type.category] = []
        }
        categories[type.category].push(type)
        return categories
      }, {})
    },
  },
}
</script>
