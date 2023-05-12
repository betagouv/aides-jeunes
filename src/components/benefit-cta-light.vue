<script setup lang="ts">
import BenefitCtaLinkLight from "./benefit-cta-link-light.vue"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.js"
import { BenefitType } from "@lib/types/benefits"
import { defineProps, computed, PropType } from "vue"

const props = defineProps({
  benefit: Object as PropType<BenefitType>,
})

const ctaForm = computed(() => {
  return ctas.value.find((cta) => cta?.type === BehaviourEventTypes.form)
})

const ctaTeleservice = computed(() => {
  return ctas.value.find((cta) => cta?.type === BehaviourEventTypes.teleservice)
})

const ctaInstructions = computed(() => {
  return ctas.value.find(
    (cta) => cta?.type === BehaviourEventTypes.instructions
  )
})

const ctas = computed(() => {
  const ctaBehaviourTypes = [
    BehaviourEventTypes.teleservice,
    BehaviourEventTypes.form,
    BehaviourEventTypes.instructions,
  ]

  return ctaBehaviourTypes
    .map((type) => {
      if (props.benefit) {
        const linkGenerator = props.benefit[`${type}Generator`]
        const link = props.benefit[type] || (linkGenerator && linkGenerator())
        return {
          type,
          link,
        }
      }
    })
    .filter(function (item) {
      return item?.link
    })
    .slice(0, 2)
})
</script>

<template>
  <div
    v-if="ctas.length > 0 && benefit"
    class="fr-container fr-py-2w aj-benefit-cta-light-container"
  >
    <h5 class="fr-h5">Comment l'obtenir ?</h5>
    <div class="fr-grid-row fr-mb-2w fr-grid-row--middle">
      <div class="fr-col-12 fr-col-sm-5 fr-py-1w fr-mr-2w">
        <BenefitCtaLinkLight
          v-if="ctaTeleservice"
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="ctaTeleservice.link"
          :type="ctaTeleservice.type"
          class="fr-btn fr-btn--sm"
        />
        <BenefitCtaLinkLight
          v-if="ctaForm"
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="ctaForm.link"
          :type="ctaForm.type"
          class="fr-btn fr-btn--secondary fr-btn--sm"
        />
      </div>
      <div class="fr-col fr-my-1w">
        <BenefitCtaLinkLight
          v-if="ctaInstructions"
          class="aj-a"
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="ctaInstructions.link"
          :type="ctaInstructions.type"
        />
      </div>
    </div>
    <div class="fr-print-hidden">
      <a
        v-if="benefit.msa"
        v-analytics="{
          name: benefit.label,
          action: BehaviourEventTypes.msa,
          category: 'General',
        }"
        class="aj-droit-pro-agricole"
        href="https://www.msa.fr/lfy/espace-prive"
        rel="noopener"
        target="_blank"
        title="Démarches pour les professions agricoles - Nouvelle fenêtre"
      >
        <img alt="" src="@/assets/images/doigt.svg" class="fr-mr-1w" />Démarches
        pour les professions agricoles
      </a>
    </div>
  </div>
</template>
