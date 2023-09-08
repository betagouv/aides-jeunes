<script setup lang="ts">
import { defineProps, PropType } from "vue"
import { LieuLayout } from "@lib/types/lieu.d.js"
import AnalyticRouterLink from "@/components/buttons/analytic-router-link.vue"
import { BehaviourEvent } from "@lib/enums/behaviour-event.js"

defineProps({
  lieu: {
    type: Object as PropType<LieuLayout>,
    required: true,
  },
})
</script>

<template>
  <div>
    <div v-if="lieu" class="fr-container fr-py-4v">
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
            {{ lieu.nom }}
          </p>
          <span data-testid="lieu-informations-link">
            <AnalyticRouterLink
              class="fr-link fr-link--sm"
              :analytic-name="lieu.id"
              :analytic-action="BehaviourEvent.ShowNewLocation"
              :to="{
                name: 'benefitLieuInformations',
                params: {
                  lieu_id: lieu.id,
                },
              }"
              >Voir les informations
            </AnalyticRouterLink>
          </span>
        </div>
      </div>
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
