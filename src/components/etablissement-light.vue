<script setup lang="ts">
import { defineProps, PropType } from "vue"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"
import { useRoute } from "vue-router"
import AnalyticRouterLink from "@/components/buttons/analytic-router-link.vue"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.js"

const $route = useRoute()
defineProps({
  etablissement: {
    type: Object as PropType<HelpingInstitution>,
    required: true,
  },
})
</script>

<template>
  <div>
    <div v-if="etablissement" class="fr-container fr-py-4v">
      <div class="fr-grid-row fr-grid-row--top">
        <div class="fr-col-2 fr-col-sm-1 fr-mt-1v fr-mr-1w">
          <span
            class="fr-icon fr-icon-building-line aj-responsive-icon-places"
            style="color: var(--main-color)"
            aria-hidden="true"
          ></span>
        </div>
        <div class="fr-grid-col fr-col-12 fr-col-sm-10">
          <p class="fr-text--bold fr-mb-1v" data-testid="etablissement-title">
            {{ etablissement.nom }}
          </p>
          <span data-testid="etablissement-informations-link">
            <AnalyticRouterLink
              class="fr-link fr-link--sm"
              :analytics="{
                name: etablissement.id,
                action: BehaviourEventTypes.showNewLocation,
                category: 'General',
              }"
              :to="{
                name: 'benefitEtablissementInformationsLight',
                params: {
                  etablissement_id: etablissement.id,
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
