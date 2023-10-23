<template>
  <div>
    <WarningMessage v-if="error" class="fr-mb-4w">{{ error }}</WarningMessage>
    <div class="aj-action-buttons fr-mt-2w">
      <ul
        class="fr-btns-group fr-btns-group--inline fr-btns-group--inline-reverse fr-btns-group--right"
      >
        <li>
          <button
            class="fr-btn"
            type="submit"
            :class="{ 'fr-btn-disabled': disableSubmit }"
            @click="localOnSubmit($event)"
          >
            Suivant
          </button>
        </li>
        <li>
          <slot />
          <BackButton @click="goBack" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackButton from "@/components/buttons/back-button.vue"
import { computed, defineProps, onMounted, onUnmounted } from "vue"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"
import WarningMessage from "@/components/warning-message.vue"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import tracker from "@/plugins/tracker.js"

const props = defineProps({
  onSubmit: {
    type: Function,
    default() {},
  },
  disableSubmit: Boolean,
})

const store = useStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  document.body.setAttribute("data-action-buttons", "true")
})
onUnmounted(() => {
  document.body.removeAttribute("data-action-buttons")
})

const error = computed(() => {
  return store.error
})

const localOnSubmit = (event) => {
  event.preventDefault()
  props.onSubmit()
}

const goBack = () => {
  tracker.trackEvent(
    EventCategory.Parcours,
    EventAction.BoutonPrecedent,
    route.fullPath
  )

  const answerIndex = store.simulation.answers.current.findIndex(
    (answer) => answer.path === route.fullPath
  )
  if (answerIndex === 0) {
    router.push("/")
  } else {
    router.go(-1)
  }
}
</script>
