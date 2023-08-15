<script setup lang="ts">
import { useStore } from "@/stores/index.js"
import storageService from "@/lib/storage-service.js"
import { PropType, computed, defineProps } from "vue"
import { useRouter } from "vue-router"
import { StandardBenefit } from "@data/types/benefits.d.js"

const store = useStore()
const $router = useRouter()

const labels = {
  teleservice: {
    short: "Faire une demande en ligne",
    long: "Faire une demande en ligne pour",
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
  level: String,
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
  if (typeof link === "object") {
    return $router.resolve(link).href
  }
  return link
}

const onClick = (link) => {
  if (typeof link === "object") {
    storageService.local.setItem("trampoline", {
      simulationId: store.calculs.resultats._id,
    })
  }
}
</script>

<template>
  <a
    :id="`cta-${type}`"
    v-analytics="{ name: analyticsName, action: type, category: 'General' }"
    :aria-label="longLabel"
    :href="getURL(link)"
    class="text-center fr-my-1w"
    rel="noopener"
    target="_blank"
    @click="onClick(link)"
    v-html="label"
  />
</template>
