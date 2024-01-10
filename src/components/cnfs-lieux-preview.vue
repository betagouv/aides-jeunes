<script setup lang="ts">
import { useLieux } from "@/composables/use-lieux.js"

const { cnfsLieux } = useLieux()
</script>

<template>
  <div>
    <div v-if="cnfsLieux" class="fr-container fr-py-4v">
      <div class="fr-grid-row fr-grid-row--top">
        <div class="fr-col-2 fr-col-sm-1 fr-mt-1v fr-mr-1w">
          <span
            class="fr-icon fr-icon-building-line aj-responsive-icon-places"
            style="color: var(--main-color)"
            aria-hidden="true"
          ></span>
        </div>
        <div class="fr-grid-col fr-col-12 fr-col-sm-10">
          <p class="fr-text--bold fr-mb-1v" data-testid="lieu-title">
            Conseillers numériques France Services
          </p>

          <router-link
            class="fr-link fr-link--sm"
            :to="{ name: 'benefitCfnsLieuxInformations' }"
            >Voir les informations sur l'ensemble des lieux de votre
            commune</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
