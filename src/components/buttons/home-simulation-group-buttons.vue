<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"
import { EventAction, EventCategory } from "@lib/enums/event.js"

const store = useStore()
const route = useRoute()
const router = useRouter()

const { proxy } = getCurrentInstance() as any
const SIMULATION_START_PATH = "/simulation/individu/demandeur/date_naissance"

const hasExistingSituation = computed(() => store.passSanityCheck)

const ctaLabel = computed(() =>
  hasExistingSituation.value
    ? "Commencer une nouvelle simulation"
    : "Commencer une simulation"
)

const initializeOpenfiscaParameters = () => {
  store.setOpenFiscaParameters()
  if (process.env.VITE_CONTEXT !== "production") {
    store.verifyOpenfiscaBenefitVariables()
  }
}

const newSituation = () => {
  store.clear(route.query.external_id as string)
  initializeOpenfiscaParameters()
  router.push(SIMULATION_START_PATH)
}

const resumeSimulation = () => {
  initializeOpenfiscaParameters()
  proxy?.$push()
}

const props = defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: null,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <ul
    class="fr-btns-group"
    :class="{
      'fr-btns-group--inline-md': props.horizontal,
      'fr-btns-group--sm': props.size === 'small',
      'fr-btns-group--inline-reverse': props.reverse,
      'fr-btns-group--right': props.reverse,
    }"
  >
    <li v-if="hasExistingSituation">
      <button
        v-analytics="{
          action: EventAction.ReprendreMaSimulation,
          category: EventCategory.Home,
        }"
        class="fr-btn"
        @click="resumeSimulation"
      >
        Reprendre ma simulation
      </button>
    </li>
    <li>
      <button
        v-if="hasExistingSituation"
        v-analytics="{ action: ctaLabel, category: EventCategory.Home }"
        class="fr-btn fr-btn--secondary"
        data-testid="new-simulation"
        @click="newSituation"
      >
        {{ ctaLabel }}
      </button>
      <router-link
        v-else
        v-analytics="{ action: ctaLabel, category: EventCategory.Home }"
        class="fr-btn"
        data-testid="new-simulation"
        :to="SIMULATION_START_PATH"
        @click="newSituation"
      >
        {{ ctaLabel }}
      </router-link>
    </li>
  </ul>
</template>
