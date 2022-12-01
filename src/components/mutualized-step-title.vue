<template>
  <span
    id="step-question"
    data-testid="question"
    v-html="props.question"
    class="fr-text--lead"
  />
  <EnSavoirPlus v-if="props.showMoreInfo" />
  <span v-if="props.help" v-html="props.help" class="fr-hint-text" />
</template>

<script lang="ts" setup>
import EnSavoirPlus from "@/components/en-savoir-plus.vue"
/* global defineProps */
const props = defineProps({
  titleWrapper: { type: String, default: "label" },
  forTitleWrapper: { type: String },
  question: { type: String, required: true },
  showMoreInfo: { type: Boolean },
  help: { type: String },
})
</script>
