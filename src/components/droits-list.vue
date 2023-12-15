<script setup lang="ts">
import { computed, defineProps } from "vue"
import DroitMixin from "@/mixins/droit-mixin.js"
import { getBenefitImage } from "@lib/benefits/details.js"
import DroitEstime from "./droit-estime.vue"
import WarningMessage from "@/components/warning-message.vue"

const {
  methods: { capitalize, isBoolean },
} = DroitMixin as any

const props = defineProps({
  droits: Array,
  ineligible: Boolean,
  filter: Array,
})

const list: any = computed(() => {
  return props.droits?.filter((value: any) => {
    return !props.filter || props.filter.includes(value.id)
  })
})

const askBenefit = (droit) => {
  return `Demander ${droit.prefix}${droit.prefix == "l’" ? "" : " "}${
    droit.label
  }`
}
</script>

<template>
  <div v-for="(droit, index) in list" :key="index" class="fr-mb-5w">
    <router-link
      class="fr-tile"
      :to="`/simulation/resultats/${droit.id}`"
      itemscope
      itemtype="http://schema.org/GovernmentService"
      :data-testid="droit.id"
      :aria-label="askBenefit(droit)"
    >
      <div class="fr-p-4w">
        <div class="aj-benefit-header fr-mb-4w">
          <img
            class="aj-institution-icon"
            :src="getBenefitImage(droit)"
            :alt="`Logo ${droit.institution.label}`"
          />
          <div class="aj-benefit-name">
            <h2 class="fr-text--lead" itemprop="name">{{
              capitalize(droit.label)
            }}</h2>
            <div class="aj-benefit-institution"
              >{{ capitalize(droit.institution.label) }}
            </div>
            <div>
              <p class="fr-text--justify" v-html="droit.description" />
              <WarningMessage
                v-if="
                  droit.montant &&
                  isBoolean(droit.montant) &&
                  droit.warning === true
                "
              >
                <img src="@/assets/images/warning.svg" alt="" /> Attention,
                cette aide vous est accessible sous certaines conditions
                supplémentaires.
              </WarningMessage>
            </div>
          </div>
          <DroitEstime :droit="droit" />
        </div>
        <ul class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--right">
          <li>
            <router-link
              :to="`/simulation/resultats/${droit.id}`"
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
