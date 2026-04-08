<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  max: { type: Number, required: true },
  rows: { type: Number, default: 5 },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
  overLimitMessage: { type: String, default: "" },
})

const model = defineModel<string>({ default: "" })

const emit = defineEmits(["clear-error"])

const currentLength = computed(() => model.value.length)
const charsOver = computed(() => Math.max(0, currentLength.value - props.max))
const isTooLong = computed(() => currentLength.value > props.max)
const hasAnyError = computed(() => props.hasError || isTooLong.value)
const currentLengthLabel = computed(() =>
  currentLength.value > 1 ? "caractères saisis" : "caractère saisi",
)
const remainingLabel = computed(() =>
  props.max - currentLength.value > 1
    ? "caractères restants"
    : "caractère restant",
)
const lengthHint = computed(() =>
  isTooLong.value
    ? `${currentLength.value} ${currentLengthLabel.value}, ${charsOver.value} en trop`
    : `${props.max - currentLength.value} ${remainingLabel.value}`,
)
const effectiveOverLimitMessage = computed(
  () =>
    props.overLimitMessage ||
    `Ce champ ne doit pas dépasser ${props.max} caractères.`,
)
</script>

<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': hasAnyError,
    }"
  >
    <label class="fr-label" :for="props.id">
      {{ props.label }}
      <span v-if="props.required" class="fr-text--error">*</span>
      <span class="fr-hint-text">{{ lengthHint }}</span>
    </label>
    <textarea
      :id="props.id"
      v-model="model"
      class="fr-input"
      :rows="props.rows"
      :placeholder="props.placeholder"
      :required="props.required"
      @input="emit('clear-error')"
    />
    <p v-if="isTooLong" class="fr-error-text">
      {{ effectiveOverLimitMessage }}
    </p>
  </div>
</template>
