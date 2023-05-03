<script setup lang="ts">
import { useStore } from "@/stores/index.js"
import storageService from "@/lib/storage-service.js"
import { PropType, computed, defineProps } from "vue"
import { useRouter } from "vue-router"

const store = useStore()
const $router = useRouter()

const typeLabels = {
  teleservice: "Faire une demande en ligne",
  form: "Accéder au formulaire papier",
  instructions: "Voir les instructions détaillées",
  link: "Plus d'informations",
}

const longLabels = {
  ...typeLabels,
  link: "Plus d'informations",
}

const props = defineProps({
  analyticsName: String,
  benefit: Object as PropType<any>,
  level: String,
  type: String,
  link: String,
})

const label = computed(() => {
  if (props.type) {
    return typeLabels[props.type]
  }
  return null
})

const longLabel = computed(() => {
  if (props.type)
    return `${longLabels[props.type]} pour ${props.benefit.prefix || ""}${
      props.benefit.prefix?.endsWith("’") ? "" : " "
    }${props.benefit.label} - Nouvelle fenêtre`
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
