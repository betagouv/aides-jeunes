<template>
  <button
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-arrow-left-line"
    :class="size && size === 'small' ? 'fr-btn--sm' : ''"
    type="button"
    @click.prevent="goBack"
  >
    <slot>Précédent</slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from "vue"
import { useRoute, useRouter } from "vue-router"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import tracker from "@/plugins/tracker.js"

const props = defineProps({
  size: {
    type: String,
    default: null,
  },
  fallback: {
    type: String,
    default: null,
  },
})
const route = useRoute()
const router = useRouter()

const goBack = () => {
  tracker.trackEvent(
    EventCategory.Parcours,
    EventAction.BoutonPrecedent,
    route.fullPath
  )

  if (window.history.state?.position === 0) {
    router.push(props.fallback)
  } else {
    router.go(-1)
  }
}
</script>
