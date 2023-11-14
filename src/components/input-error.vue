<script setup lang="ts">
import { computed, defineProps } from "vue"

const props = defineProps({
  fieldName: {
    type: [String, Date],
    default: null,
  },
  formError: {
    type: Boolean,
    default: false,
  },
})
const display = computed(() => {
  return props.formError && !props.fieldName
})
</script>

<template>
  <div v-if="display" id="text-input-error-desc-error" class="fr-error-text">
    Champ obligatoire
  </div>
</template>
