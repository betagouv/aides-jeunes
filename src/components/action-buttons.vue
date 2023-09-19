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
import { getAnswerIndexByPath } from "@lib/answers.js"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"
import WarningMessage from "@/components/warning-message.vue"
import { EventCategory } from "@lib/enums/event-category.js"

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
  window.Piwik?.getTracker()?.trackEvent(
    EventCategory.Parcours,
    "Bouton précédent",
    route.fullPath
  )
  const answerIndex = getAnswerIndexByPath(
    store.simulation.answers.current,
    route.fullPath
  )
  if (answerIndex > 0) {
    const previousAnswer = store.simulation.answers.current[answerIndex - 1]
    const currentAnswer = store.simulation.answers.current[answerIndex]

    const childrenLength = store.simulation.enfants?.length
    const childIndex = childrenLength ? childrenLength - 1 : null

    if (
      childrenLength &&
      currentAnswer.entityName === "individu" &&
      currentAnswer.id === `enfant_${childIndex}` &&
      store.simulation.enfants?.length === childrenLength
    ) {
      store.updateAnswersOnBackAddEnfant(childIndex, answerIndex)
      router.push({ path: "/simulation/enfants" })
    } else {
      router.push({ path: previousAnswer.path })
    }
  } else if (answerIndex === 0) {
    router.push("/")
  } else {
    window.history.back()
  }
}
</script>
