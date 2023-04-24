<script setup lang="ts">
import { defineProps, computed, PropType } from "vue"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"
import { useRouter } from "vue-router"

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
      <h2 class="fr-tile__title fr-mb-3w">
        {{ etablissement.nom }}
      </h2>
      <router-link
        v-if="hasBenefitId"
        class="fr-link fr-link--sm"
        :to="{
          name: 'etablissementInformationsByBenefit',
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
          name: 'etablissementInformations',
          params: {
            etablissement_id: etablissement.id,
          },
        }"
        >Voir les informations
      </router-link>
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
