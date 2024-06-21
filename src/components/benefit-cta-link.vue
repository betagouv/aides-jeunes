<script setup lang="ts">
import { useStore } from "@/stores/index.js"
import storageService from "@/lib/storage-service.js"
import { PropType, computed, defineProps } from "vue"
import { useRouter } from "vue-router"
import { StandardBenefit } from "@data/types/benefits.d.js"
import { CTALabel } from "@lib/enums/cta.js"
import { EventCategory } from "@lib/enums/event"
import { useBenefits } from "@/composables/use-benefits.js"

const store = useStore()
const $router = useRouter()

const { benefits } = useBenefits()

const labels = {
  teleservice: {
    short: "Faire une demande en ligne",
    long: "Faire une demande en ligne pour",
  },
  teleservicePrefill: {
    short: "Faire une demande pré-remplie en ligne",
    long: "Faire une demande pré-remplie en ligne pour",
  },
  teleserviceSupport: {
    short: "Se faire accompagner par téléphone",
    long: "Se faire accompagner par téléphone",
  },
  form: {
    short: "Accéder au formulaire papier",
    long: "Accéder au formulaire papier pour",
  },
  instructions: {
    short: "Voir les instructions détaillées",
    long: "Voir les instructions détaillées pour",
  },
  link: {
    short: "Plus d'informations",
    long: "Plus d'informations pour",
  },
}

const props = defineProps({
  analyticsName: String,
  benefit: { type: Object as PropType<StandardBenefit>, required: true },
  type: String,
  link: String,
})

const label = computed(() => (props.type ? labels[props.type].short : null))

const longLabel = computed(() => {
  if (props.type) {
    const prefix = props.benefit.prefix || ""
    const label = props.benefit.label || ""
    const endsWithQuote = prefix.endsWith("’")
    return `${labels[props.type].long} ${prefix}${
      endsWithQuote ? "" : " "
    }${label} - Nouvelle fenêtre`
  }
  return ""
})

const getURL = (link) => {
  if (props.type === CTALabel.TeleservicePrefill) {
    return $router.resolve(`/redirection?vers=${link}`).href
  }
  return link
}

const onClick = () => {
  if (
    props.type === CTALabel.TeleservicePrefill ||
    props.type === CTALabel.TeleserviceSupport
  ) {
    storageService.local.setItem("trampoline", {
      simulationId: store.calculs.resultats._id,
    })
  }
  if (props.type === CTALabel.TeleserviceSupport) {
    store.setModalState("show")
  } else {
    window.open(getURL(props.link), "_blank")
  }
}
</script>

<template>
  <button
    :id="`cta-${type}`"
    v-analytics="{
      name: analyticsName,
      action: type,
      category: EventCategory.General,
      benefits: benefits,
    }"
    data-fr-opened="false"
    aria-controls="fr-modal-support"
    :aria-label="longLabel"
    class="fr-my-1w"
    rel="noopener"
    target="_blank"
    @click="onClick()"
    v-html="label"
  />
</template>
