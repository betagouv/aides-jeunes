<template>
  <form>
    <div v-if="ressourcesYesNoQuestion">
      <h2 class="aj-question">
        <div>
          <span v-if="individu._role === 'conjoint'"
            >Votre conjoint(e) a-t'il/elle
          </span>
          <span v-else-if="individu._role !== 'demandeur'"
            >{{ individu._firstName }} a-t'il/elle
          </span>
          <span v-else>Avez-vous perçu des revenus </span>
          <span>
            depuis {{ $store.state.dates.twelveMonthsAgo.label }} (revenus
            professionels, allocations, indemnités, pensions, bourses) ?</span
          >
        </div>
      </h2>
      <fieldset>
        <div class="aj-selection-wrapper">
          <input
            id="ressources"
            v-model="ressources"
            type="radio"
            name="ressources"
            :value="true"
          />
          <label for="ressources"> Oui </label>
        </div>
        <div class="aj-selection-wrapper">
          <input
            id="no-ressources"
            v-model="ressources"
            type="radio"
            name="ressources"
            :value="false"
          />
          <label for="no-ressources"> Non </label>
        </div>
      </fieldset>
    </div>
    <div v-if="ressources || !ressourcesYesNoQuestion">
      <p>
        Sélectionnez les types de ressources perçues
        <strong>
          <span v-if="individu._role === 'conjoint'"
            >par votre conjoint(e)</span
          >
          <span v-else-if="individu._role !== 'demandeur'"
            >par {{ individu._firstName }}</span
          >
          depuis {{ $store.state.dates.twelveMonthsAgo.label }}</strong
        >. Vous pourrez ensuite saisir les montants.
      </p>
      <div
        v-for="category in categories"
        :key="category.id"
        class="form__group"
      >
        <h2 class="aj-question">
          {{ $filters.capitalize(category.label(individu)) }}
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
import orderBy from "lodash/orderBy"
import groupBy from "lodash/groupBy"
import { ressourceCategories, ressourceTypes } from "../../../lib/resources"
import Ressource from "@/../lib/ressource"
import { getAnswer } from "../../../lib/answers"
import ABTestingService from "@/plugins/ab-testing-service"

export default {
  name: "RessourceTypes",
  components: {
    ActionButtons,
  },
  props: {
    individu: Object,
  },
  data: function () {
    const abTesting = ABTestingService.getEnvironment()
    const ressourcesYesNoQuestion =
      abTesting.ressourcesYesNoQuestion.value === "collapse"

    let types = ressourceTypes.filter((ressourceType) => {
      return (
        Ressource.isRessourceOnMainScreen(ressourceType) &&
        Ressource.isRessourceRelevant(
          ressourceType,
          this.$store.getters.situation,
          this.individu
        )
      )
    })

    const selectedRessources = getAnswer(
      this.$store.state.simulation.answers.all,
      "individu",
      "ressources",
      this.$route.params.id
    )
    const ressources =
      typeof selectedRessources === "undefined"
        ? null
        : selectedRessources.length > 0
    const selectedTypes = {}
    types.forEach((type) => {
      selectedTypes[type.id] = selectedRessources?.includes(type.id)
    })
    return {
      ressourcesYesNoQuestion: ressourcesYesNoQuestion,
      ressources: ressources,
      categories: ressourceCategories,
      typesByCategories: groupBy(types, (t) => t.category),
      selectedTypes,
    }
  },
  computed: {
    countLabel: function () {
      const count = Object.keys(this.selectedTypes).filter(
        (selectType) => this.selectedTypes[selectType]
      ).length
      return `${count} ${
        count == 1 ? "ressource sélectionnée" : "ressources sélectionnées"
      }`
    },
  },
  watch: {
    individu: function () {
      this.selectedTypes = Ressource.getIndividuRessourceTypes(
        this.individu,
        this.$store.getters.situation
      )
    },
  },
  methods: {
    onSubmit: function () {
      this.$store.dispatch("answer", {
        id: this.$route.params.id,
        entityName: "individu",
        fieldName: "ressources",
        value: Object.keys(this.selectedTypes).filter(
          (type) =>
            (this.ressources || !this.ressourcesYesNoQuestion) &&
            this.selectedTypes[type]
        ),
      })
      this.$push()
    },
    sort: function (array) {
      return orderBy(array, ["positionInList", "label"])
    },
  },
}
</script>
