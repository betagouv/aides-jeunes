<script setup lang="ts">
import { defineProps, computed, PropType } from "vue"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"
import { useRouter } from "vue-router"
import EtablissementInformations from "./etablissement-informations.vue"
import ABTestingService from "@/plugins/ab-testing-service.js"

interface ABTestingServiceType {
  getValues(): any
  setVariant(key: any, value: any): any
}

const abTestingValue = computed(() => {
  const abTest: ABTestingServiceType = ABTestingService
  return abTest.getValues().css_text
})

defineProps({
  etablissement: {
    type: Object as PropType<HelpingInstitution>,
    required: true,
  },
})

const $router = useRouter()

const hasBenefitId = computed(() => {
  return $router.currentRoute.value.params.benefit_id
})
</script>

<template>
  <div class="fr-tile fr-tile--horizontal fr-mb-6w">
    <div v-if="etablissement" class="fr-container fr-p-4w">
      <h2 class="fr-tile__title fr-mb-3w" data-testid="etablissement-title">
        {{ etablissement.nom }}
      </h2>
      <span
        v-if="
          $route.name === 'resultatsLieuxGeneriques' || abTestingValue === 'D'
        "
      >
        <etablissement-informations :etablissement="etablissement" />
      </span>
      <span v-else data-testid="etablissement-informations-link">
        <router-link
          v-if="hasBenefitId"
          class="fr-link fr-link--sm"
          :to="{
            name: 'benefitEtablissementInformations',
            params: {
              etablissement_id: etablissement.id,
            },
          }"
          >Voir les informations
        </router-link>
        <router-link
          v-else
          class="fr-link fr-link--sm"
          :to="{
            name: 'situationEtablissementInformations',
            params: {
              etablissement_id: etablissement.id,
            },
          }"
          >Voir les informations
        </router-link>
      </span>
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
