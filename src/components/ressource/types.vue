<template>
  <form>
    <p>
      Sélectionnez les types de ressources perçues
      <strong>
        <span v-if="individu._role === 'demandeur'">par vous uniquement</span>
        <span v-else-if="individu._role === 'conjoint'"
          >par votre conjoint(e)</span
        >
        <span v-else> par {{ individu._firstName }} </span>
        depuis {{ store.dates.twelveMonthsAgo.label }}</strong
      >. Vous pourrez ensuite saisir les montants.
    </p>
    <div
      v-if="showInitialResourcesCollectionWarning"
      class="fr-alert fr-alert--info fr-my-1w fr-mb-3w"
    >
      <p
        >Les ressources perçues par {{ additionnalResourcesText }} seront
        demandées plus tard dans le simulateur.
      </p>
    </div>
    <fieldset
      v-for="category in categories"
      :key="category.id"
      class="fr-fieldset fr-mb-4w"
    >
      <legend class="fr-fieldset__legend fr-px-0">
        <span class="fr-text--lead fr-text--bold">
          {{ capitalize(category.label) }}
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
import { capitalize } from "@lib/utils.js"
import IndividuMethods from "@lib/individu"
import { datesGenerator } from "@lib/dates"

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
      capitalize,
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
    allActiveSteps() {
      return this.store.getAllSteps.filter((step) => step.isActive)
    },
    needCoupleResources() {
      return this.allActiveSteps.filter(
        (step) => step.id === "conjoint" && step.variable === "ressources"
      ).length
    },
    needParentsResources() {
      return (
        this.allActiveSteps.filter(
          (step) => step.entity === "parents" && step.variable === "rfr"
        ).length ||
        this.allActiveSteps.filter(
          (step) =>
            step.id === "demandeur" &&
            step.variable ===
              "bourse_criteres_sociaux_base_ressources_parentale"
        ).length
      )
    },
    numberChildrenMore16() {
      return this.store.situation?.enfants?.filter(
        (enfants) =>
          IndividuMethods.age(
            enfants,
            datesGenerator(this.store.situation?.dateDeValeur).today.value
          ) > 15
      ).length
    },
    showInitialResourcesCollectionWarning() {
      return (
        this.individu._role === "demandeur" && this.additionnalResources.length
      )
    },
    additionnalResources() {
      return [
        ...(this.needCoupleResources ? ["votre conjoint(e)"] : []),
        ...(this.numberChildrenMore16 > 1 ? ["vos enfants"] : []),
        ...(this.numberChildrenMore16 === 1 ? ["votre enfant"] : []),
        ...(this.needParentsResources ? ["vos parents ou tuteurs légaux"] : []),
      ]
    },
    additionnalResourcesText() {
      const last = this.additionnalResources.slice(-1)
      const others = this.additionnalResources.slice(0, -1)
      return [...(others.length ? [others.join(", ")] : []), last].join(" et ")
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
