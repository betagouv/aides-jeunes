<template>
  <span
    id="step-question"
    data-testid="question"
    class="fr-text--lead"
    v-html="props.question"
  />
  <EnSavoirPlus v-if="props.showMoreInfo" />
  <span v-if="props.help" class="fr-hint-text" v-html="props.help" />
</template>

<script lang="ts" setup>
import EnSavoirPlus from "@/components/en-savoir-plus.vue"
const props = defineProps({
  titleWrapper: { type: String, default: "label" },
  forTitleWrapper: { type: String },
  question: { type: String, required: true },
  showMoreInfo: { type: Boolean },
  help: { type: String },
})
</script>
