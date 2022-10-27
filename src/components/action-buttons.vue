<script setup>
import BackButton from "@/components/buttons/back-button.vue"
import { computed, defineProps } from "vue"
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

<template>
  <div>
    <WarningMessage v-if="error" class="aj-actions-error">{{
      error
    }}</WarningMessage>
    <div class="aj-actions">
      <button
        class="button next-button"
        type="submit"
        :class="{ disabled: disableSubmit }"
        @click="localOnSubmit($event)"
      >
        Suivant
      </button>
      <slot />
      <BackButton class="previous-button" @click="goBack" />
    </div>
  </div>
</template>
