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

<script setup>
import BackButton from "@/components/buttons/back-button.vue"
import { computed, defineProps, onMounted, onUnmounted } from "vue"
import { getAnswerIndex } from "@lib/answers"
import { useStore } from "@/stores"
import { useRoute, useRouter } from "vue-router"
import WarningMessage from "@/components/warning-message.vue"

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
  window._paq.push([
    "trackEvent",
    "Parcours",
    "Bouton précédent",
    route.fullPath,
  ])
  const entityName = route.path.split("/")[2]
  const id = route.path.split("/")[3]
  const fieldName = route.path.split("/")[4]

  const answerIndex = getAnswerIndex(
    store.simulation.answers.all,
    entityName,
    id,
    fieldName
  )
  if (answerIndex > 0) {
    const previousAnswer = store.simulation.answers.all[answerIndex - 1]
    let previousRoute = `/simulation/${previousAnswer.entityName}`
    if (previousAnswer.id) {
      previousRoute += `/${previousAnswer.id}`
    }
    if (previousAnswer.fieldName) {
      previousRoute += `/${previousAnswer.fieldName}`
    }
    router.push({ path: previousRoute })
  } else if (answerIndex === 0) {
    router.push("/")
  } else {
    window.history.back()
  }
}
</script>
