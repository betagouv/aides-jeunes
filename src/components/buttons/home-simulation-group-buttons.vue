<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"
import { useStore } from "@/stores/index.js"
import { useRoute } from "vue-router"
import { EventAction, EventCategory } from "@lib/enums/event.js"

const { proxy } = getCurrentInstance() as any

const store = useStore()
const route = useRoute()

const hasExistingSituation = computed(() => store.passSanityCheck)

const ctaLabel = computed(() =>
  hasExistingSituation.value
    ? "Commencer une nouvelle simulation"
    : "Je commence"
)

const newSituation = () => {
  store.clear(route.query.external_id as string)
  next()
}

const next = () => {
  store.setOpenFiscaParameters()
  if (process.env.VITE_CONTEXT !== "production") {
    store.verifyBenefitVariables()
  }
  proxy?.$push()
}
</script>

<template>
  <ul class="fr-btns-group">
    <li v-if="hasExistingSituation">
      <button
        v-analytics="{
          action: EventAction.ReprendreMaSimulation,
          category: EventCategory.Home,
        }"
        class="fr-btn"
        @click="next"
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
        to="/simulation/individu/demandeur/date_naissance"
        @click="newSituation"
      >
        {{ ctaLabel }}
      </router-link>
    </li>
  </ul>
</template>
