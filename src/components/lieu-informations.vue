<script setup lang="ts">
import { computed, defineProps, PropType } from "vue"
import { LieuProperties } from "@lib/types/lieu.d.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"

const props = defineProps({
  lieu: {
    type: Object as PropType<LieuProperties>,
    required: true,
  },
})

const hasContact = computed(() => {
  return props.lieu?.url || props.lieu?.telephone
})

const siteInternetEvent = computed(() => {
  return {
    name: props.lieu?.id,
    action: EventAction.SiteInternet,
    category: EventCategory.Partenaire,
  }
})

const telephoneEvent = computed(() => {
  return {
    name: props.lieu?.id,
    action: EventAction.Telephone,
    category: EventCategory.Partenaire,
  }
})

const extractHHMM = (dateString: string) => {
  return dateString.slice(0, 5)
}
</script>
<template>
  <address
    v-if="lieu.adresse"
    class="fr-hint-text fr-mb-3w"
    data-testid="lieu-address"
  >
    <span
      class="fr-icon--sm fr-icon-map-pin-2-line fr-mr-1w"
      aria-hidden="true"
    ></span>
    <span
      > Adresse : {{ lieu.adresse.lignes.join(", ") }}
      {{ lieu.adresse.codePostal }}
      {{ lieu.adresse.commune }}</span
    >
  </address>
  <div v-if="lieu.telephone" class="fr-hidden fr-unhidden-sm fr-mb-3w">
    <span
      class="fr-icon--sm fr-icon-phone-fill fr-mr-1w"
      aria-hidden="true"
    ></span>
    {{ lieu.telephone }}
  </div>
  <div v-if="lieu.horaires" class="fr-mb-3w">
    <div class="fr-my-2w">
      <span
        class="fr-icon--sm fr-icon-time-line fr-mr-1w"
        aria-hidden="true"
      ></span>
      Horaires d'ouverture :
    </div>
    <div class="fr-container fr-container--fluid fr-px-6v">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div
          v-for="plage_jour in lieu.horaires"
          :key="plage_jour.du"
          class="fr-col-6 fr-col-lg-4"
        >
          <div v-if="plage_jour.du === plage_jour.au" class="fr-text--bold">
            Les {{ plage_jour.du }}s
          </div>
          <div v-if="plage_jour.du !== plage_jour.au" class="fr-text--bold">
            Du {{ plage_jour.du }} au {{ plage_jour.au }}
          </div>
          <ul class="fr-raw-list">
            <li v-for="plage_heure in plage_jour.heures" :key="plage_heure.de">
              de {{ extractHHMM(plage_heure.de) }} à
              {{ extractHHMM(plage_heure.a) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="fr-container">
    <ul
      v-if="hasContact"
      class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--right"
    >
      <li v-if="lieu.url">
        <a
          v-analytics="siteInternetEvent"
          :aria-label="`Site internet : ${lieu.nom} - Nouvelle fenêtre`"
          :href="lieu.url"
          class="fr-btn"
          rel="noopener"
          target="_blank"
        >
          Site internet
        </a>
      </li>
      <li v-if="lieu.telephone">
        <a
          v-analytics="telephoneEvent"
          :href="`tel:${lieu.telephone}`"
          class="fr-btn fr-hidden-sm"
          rel="noopener"
          target="_blank"
        >
          {{ lieu.telephone }}
        </a>
      </li>
    </ul>
  </div>
</template>
