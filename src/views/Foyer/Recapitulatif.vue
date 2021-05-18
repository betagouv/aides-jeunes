<template>
  <form>
    <router-link v-if="canGoToResults" to="/foyer/resultat"
      >Aller directement à la page de résultat</router-link
    >

    <ul>
      <li v-for="step in previousSteps" v-bind:key="step.name">
        <router-link v-bind:to="step.route">{{ step.name }}</router-link>
      </li>
      <li v-for="step in nextSteps" v-bind:key="step.name">
        {{ step.name }}
      </li>
    </ul>
  </form>
</template>

<script>
import indexOf from "lodash/indexOf"
import findIndex from "lodash/findIndex"

const steps = [
  {
    name: "Vous",
    route: "/foyer/demandeur",
  },
  {
    name: "Vos enfants",
    route: "/foyer/enfants",
  },
  {
    name: "Votre conjoint",
    route: "/foyer/conjoint",
  },
  {
    name: "Votre logement",
    route: "/foyer/logement",
  },
  {
    name: "Les ressources de votre foyer",
    route: {
      name: "ressources/types",
      params: {
        role: "demandeur",
        id: undefined,
      },
    },
  },
  {
    name: "Les pensions alimentaires versées",
    route: "/foyer/pensions-alimentaires",
  },
  {
    name: "Vos ressources fiscales",
    route: "/foyer/ressources/fiscales",
    isPast: function (store) {
      return store.getters.ressourcesYearMinusTwoCaptured
    },
    hideAsNext: true,
  },
  {
    name: "Votre patrimoine",
    route: "/foyer/ressources/patrimoine",
    isPast: function (store) {
      return store.getters.hasPatrimoine !== undefined
    },
    hideAsNext: true,
  },
]

function isPast(past, step, store, bypass) {
  if (step.isPast) {
    return step.isPast(store)
  }

  return (
    bypass || indexOf(past, step.route) >= 0 || findIndex(past, step.route) >= 0
  )
}

export default {
  name: "recapitulatif",
  computed: {
    previousRoutes: function () {
      return this.$parent.steps.slice(0, this.$parent.currentStepIndex)
    },
    previousSteps: function () {
      return steps.reduce(
        (a, s) => {
          if (a.missing) {
            return a
          }

          if (
            isPast(this.previousRoutes, s, this.$store, this.canGoToResults)
          ) {
            a.array.push(s)
          } else {
            a.missing = true
          }
          return a
        },
        { missing: false, array: [] }
      ).array
    },
    nextSteps: function () {
      return steps.slice(this.previousSteps.length).filter((s) => !s.hideAsNext)
    },
    canGoToResults: function () {
      return this.$store.state.situation._id
    },
  },
}
</script>
