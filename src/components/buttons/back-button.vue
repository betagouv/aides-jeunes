<template>
  <button
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-arrow-left-line"
    :class="size && size === 'small' ? 'fr-btn--sm' : ''"
    type="button"
  >
    <slot>Précédent</slot>
  </button>
</template>

<script lang="ts">
export default {
  name: "BackButton",
  props: {
    size: {
      type: String,
      default: null,
    },
  },
}
</script>
