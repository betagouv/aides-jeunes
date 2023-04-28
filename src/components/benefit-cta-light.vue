<script setup lang="ts">
import BenefitCtaLinkLight from "./benefit-cta-link-light.vue"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.js"
import { defineProps, computed, PropType } from "vue"

const props = defineProps({
  benefit: Object as PropType<any>,
})

const levels = ["success", "default"]

const ctas = computed(() => {
  const ctaBehaviourTypes = [
    BehaviourEventTypes.teleservice,
    BehaviourEventTypes.form,
    BehaviourEventTypes.instructions,
  ]

  return (
    ctaBehaviourTypes
      .map((type) => {
        const linkGenerator = props.benefit[`${type}Generator`]
        const link = props.benefit[type] || (linkGenerator && linkGenerator())
        return {
          type,
          link,
        }
      })
      .filter(function (item) {
        return item.link
      })
      .slice(0, 2)
      // add a form link to the end of the list if there is no form link
      .concat([
        {
          type: BehaviourEventTypes.form,
          link: "test.Fr",
        },
        {
          type: BehaviourEventTypes.instructions,
          link: "test.Fr",
        },
      ])
  )
})
</script>

<template>
  <div
    v-if="ctas.length > 0"
    class="fr-container fr-py-2w aj-benefit-cta-light-container"
  >
    <h6>Comment l'obtenir ?</h6>
    <div class="fr-grid-row fr-mb-2w">
      <div
        v-for="(cta, index) in ctas"
        :key="index"
        class="fr-col fr-col-md-5 fr-mr-2w fr-my-1w"
      >
        <BenefitCtaLinkLight
          :analytics-name="benefit.id"
          :benefit="benefit"
          :link="cta.link"
          :type="cta.type"
          :level="levels[index]"
        />
      </div>
    </div>
    <div class="fr-print-hidden">
      <a
        v-if="benefit.msa"
        v-analytics="{
          name: benefit.label,
          action: eventTypeMSA,
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
