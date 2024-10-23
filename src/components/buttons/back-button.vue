<!-- Documentation: https://github.com/betagouv/aides-jeunes/wiki/Composant-back%E2%80%90button.vue -->
<template>
  <component
    :is="asLink ? 'router-link' : 'button'"
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-arrow-left-line"
    :class="{ 'fr-btn--sm': size === 'small' }"
    :type="asLink ? undefined : 'button'"
    :to="asLink ? to : undefined"
    @click="asLink ? undefined : goBack()"
  >
    <slot>Précédent</slot>
  </component>
</template>

<script setup lang="ts">
import { defineProps } from "vue"
import { useRoute, useRouter } from "vue-router"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import tracker from "@/plugins/tracker.js"
import * as Sentry from "@sentry/vue"

const props = defineProps({
  size: {
    type: String,
    default: null,
  },
  fallback: {
    type: String,
    default: null,
  },
  asLink: {
    type: Boolean,
    default: false,
  },
  to: {
    type: String,
    default: "/",
  },
})
const route = useRoute()
const router = useRouter()

const goBack = () => {
  tracker.trackEvent(
    EventCategory.Parcours,
    EventAction.BoutonPrecedent,
    `${window.history.state?.position === 0 ? "Nouvel onglet - " : ""}${
      route.fullPath
    }`
  )

  if (window.history.state?.position === 0) {
    if (!props.fallback) {
      Sentry.captureMessage("No fallback route to go back")
      router.push("/")
    } else {
      router.push(props.fallback)
    }
  } else {
    router.go(-1)
  }
}
</script>
