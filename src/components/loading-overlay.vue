<template>
  <div
    v-if="open"
    class="aj-contribuer-loading-overlay"
    role="dialog"
    aria-modal="true"
    :aria-label="ariaLabel"
  >
    <div
      class="aj-contribuer-loading-card fr-container fr-container--fluid fr-container-md"
    >
      <div class="fr-modal__content fr-text--center">
        <span
          class="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
          aria-hidden="true"
        ></span>
        <h2 class="fr-h4 fr-mt-3w fr-mb-1w">{{ title }}</h2>
        <p class="fr-text--sm fr-mb-0">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    ariaLabel?: string
    title?: string
    message?: string
  }>(),
  {
    ariaLabel: "Envoi en cours",
    title: "Envoi en cours…",
    message: "Nous préparons votre proposition.",
  },
)
</script>
