<template>
  <div>
    <WarningMessage v-if="error" class="fr-mb-4w">{{ error }}</WarningMessage>
    <div class="aj-action-buttons fr-mt-2w">
      <span id="action-buttons-desktop">
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
            <BackButton fallback="/" />
            <button
              class="fr-btn fr-btn--secondary"
              type="button"
              @click="comeBackLaterButtonClick"
            >
              Revenir plus tard ?
            </button>
          </li>
        </ul>
      </span>
      <span id="action-buttons-mobile">
        <ul class="fr-btns-group fr-btns-group--center">
          <li>
            <button
              class="fr-btn fr-btn--secondary"
              type="button"
              @click="comeBackLaterButtonClick"
            >
              Revenir plus tard ?
            </button>
          </li>
        </ul>
        <ul
          class="aj-action-buttons-sm fr-btns-group fr-btns-group--inline fr-btns-group--inline-reverse fr-btns-group--right"
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
            <BackButton class="aj-action-button-li-sm" fallback="/" />
          </li>
        </ul>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackButton from "@/components/buttons/back-button.vue"
import { computed, defineProps, onMounted, onUnmounted } from "vue"
import { useStore } from "@/stores/index.js"
import { useRouter } from "vue-router"
import WarningMessage from "@/components/warning-message.vue"

const props = defineProps({
  onSubmit: {
    type: Function,
    default() {},
  },
  disableSubmit: Boolean,
})

onMounted(() => {
  document.body.setAttribute("data-action-buttons", "true")
})
onUnmounted(() => {
  document.body.removeAttribute("data-action-buttons")
})

const store = useStore()
const router = useRouter()
const error = computed(() => {
  return store.error
})

const localOnSubmit = (event) => {
  event.preventDefault()
  props.onSubmit()
}

const comeBackLaterButtonClick = () => router.push({ name: "revenirPlusTard" })
</script>
