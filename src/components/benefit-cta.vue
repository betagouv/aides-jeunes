<script setup lang="ts">
import BenefitCtaLink from "./benefit-cta-link.vue"
import { CTALabel } from "@lib/enums/cta.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import { StandardBenefit } from "@data/types/benefits.d.js"
import { defineProps, computed, PropType } from "vue"
import { useBenefits } from "@/composables/use-benefits"

const props = defineProps({
  benefit: Object as PropType<StandardBenefit>,
})

const { benefits } = useBenefits()

const ctaForm = computed(() => {
  return ctas.value.find((cta) => cta?.type === CTALabel.Form)
})

const ctaTeleservice = computed(() => {
  return ctas.value.find((cta) => cta?.type === CTALabel.Teleservice)
})

const ctaTeleservicePrefill = computed(() => {
  return (
    !ctaTeleservice.value &&
    ctas.value.find((cta) => cta?.type === CTALabel.TeleservicePrefill)
  )
})

const ctaInstructions = computed(() => {
  return ctas.value.find((cta) => cta?.type === CTALabel.Instructions)
})

const ctas = computed(() => {
  const ctaBehaviourTypes = [
    CTALabel.Teleservice,
    CTALabel.Form,
    CTALabel.Instructions,
    CTALabel.TeleservicePrefill,
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
    .filter((item) => item?.link)
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
      <div
        v-if="ctaTeleservice || ctaTeleservicePrefill || ctaForm"
        class="fr-col-12 fr-col-sm-5 fr-py-1w fr-mr-2w"
      >
        <BenefitCtaLink
          v-if="ctaTeleservice"
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="ctaTeleservice.link"
          :type="ctaTeleservice.type"
          class="fr-btn fr-btn--sm"
        />
        <BenefitCtaLink
          v-if="ctaTeleservicePrefill"
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="ctaTeleservicePrefill.link"
          :type="ctaTeleservicePrefill.type"
          class="fr-btn fr-btn--sm"
        />
        <BenefitCtaLink
          v-if="ctaForm"
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="ctaForm.link"
          :type="ctaForm.type"
          class="fr-btn fr-btn--secondary fr-btn--sm"
        />
      </div>
      <div class="fr-col fr-my-1w">
        <BenefitCtaLink
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
          name: benefit.id,
          action: EventAction.Msa,
          category: EventCategory.General,
          benefits: benefits,
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
