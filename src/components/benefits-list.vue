<script setup lang="ts">
import { computed, defineProps } from "vue"
import { getBenefitImage } from "@lib/benefits/details.js"
import DroitEstime from "./droit-estime.vue"
import WarningMessage from "@/components/warning-message.vue"
import { Benefit } from "@data/types/benefits"
import useUtils from '@/composables/use-utils.js';

const { capitalizeString, isBoolean } = useUtils()

const props = defineProps({
  benefits: Array<Benefit>,
  ineligible: Boolean,
  filter: Array<any>,
})

const list: any = computed(() => {
  return props.benefits?.filter((value: any) => {
    return !props.filter || props.filter.includes(value.id)
  })
})

const askBenefit = (benefit) => {
  return `Demander ${benefit.prefix}${benefit.prefix == "l’" ? "" : " "}${
    benefit.label
  }`
}
</script>

<template>
  <div v-for="(benefit, index) in list" :key="index" class="fr-mb-5w">
    <router-link
      class="fr-tile"
      :to="`/simulation/resultats/${benefit.id}`"
      itemscope
      itemtype="http://schema.org/GovernmentService"
      :data-testid="benefit.id"
      :aria-label="askBenefit(benefit)"
    >
      <div class="fr-p-4w">
        <div class="aj-benefit-header fr-mb-4w">
          <img
            class="aj-institution-icon"
            :src="getBenefitImage(benefit)"
            :alt="`Logo ${benefit.institution.label}`"
          />
          <div class="aj-benefit-name">
            <h2 class="fr-text--lead" itemprop="name">{{
              capitalizeString(benefit.label)
            }}</h2>
            <div class="aj-benefit-institution"
              >{{ capitalizeString(benefit.institution.label) }}
            </div>
            <div>
              <p class="fr-text--justify" v-html="benefit.description" />
              <WarningMessage
                v-if="
                  benefit.montant &&
                  isBoolean(benefit.montant) &&
                  benefit.warning === true
                "
              >
                <img src="@/assets/images/warning.svg" alt="" /> Attention,
                cette aide vous est accessible sous certaines conditions
                supplémentaires.
              </WarningMessage>
            </div>
          </div>
          <DroitEstime :droit="benefit" />
        </div>
        <ul class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--right">
          <li>
            <router-link
              :to="`/simulation/resultats/${benefit.id}`"
              class="fr-btn fr-my-0"
              data-testid="aide-cta"
            >
              Demander cette aide
            </router-link>
          </li>
        </ul>
      </div>
    </router-link>
  </div>
</template>
