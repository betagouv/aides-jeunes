<script setup lang="ts">
import Etablissement from "@/components/etablissement.vue"
import BackButton from "@/components/buttons/back-button.vue"
import { useEtablissements } from "@/composables/use-etablissements.js"

const { etablissements, updating } = useEtablissements()
</script>

<template>
  <router-link :to="{ name: 'resultats' }">
    <BackButton class="fr-mb-4w" size="small">Retour aux résultats </BackButton>
  </router-link>

  <p v-show="updating">
    <span
      class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
      aria-hidden="true"
    ></span
    ><span class="fr-ml-2w">Récupération en cours…</span>
  </p>
  <div v-if="etablissements?.length">
    <p>
      Voici les lieux où vous pouvez y être accompagné(e) pour faire vos
      demandes et poser toutes vos questions.
    </p>

    <div v-for="(etablissement, index) in etablissements" :key="index">
      <Etablissement :etablissement="etablissement" />
    </div>
  </div>
</template>
