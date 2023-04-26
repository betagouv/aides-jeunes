<script setup lang="ts">
import { defineProps, PropType } from "vue"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"
import { useRoute } from "vue-router"

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
        <div class="fr-grid-col">
          <h6 class="fr-h6 fr-mb-1v" data-testid="etablissement-title">
            {{ etablissement.nom }}
          </h6>
          <span data-testid="etablissement-informations-link">
            <router-link
              v-if="$route.name === 'aide'"
              class="fr-link fr-link--sm"
              :to="{
                name: 'helpBenefitEtablissementInformationsLight',
                params: {
                  etablissement_id: etablissement.id,
                  droitId: $route.params.benefitId,
                },
              }"
              >Voir les informations
            </router-link>
            <router-link
              v-else
              class="fr-link fr-link--sm"
              :to="{
                name: 'benefitEtablissementInformationsLight',
                params: {
                  etablissement_id: etablissement.id,
                },
              }"
              >Voir les informations
            </router-link>
          </span>
        </div>
      </div>
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
