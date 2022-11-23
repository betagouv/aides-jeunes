<template>
  <component
    :is="titleWrapper && forTitleWrapper ? titleWrapper : 'div'"
    :for="forTitleWrapper"
  >
    <h2 class="fr-mb-0">
      <span
        data-testid="question"
        v-html="props.question"
        class="fr-display-sm fr-text--lead fr-pr-3w"
      />
      &nbsp;
      <EnSavoirPlus v-if="props.showMoreInfo" />
    </h2>
  </component>
  <p v-if="props.help" v-html="props.help" class="fr-mt-2w fr-hint-text" />
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
