<template>
  <div>
    <component :is="titleWrapper" :for="forTitleWrapper">
      <h2 class="aj-question">
        <span v-html="props.question" />
        <EnSavoirPlus v-if="props.showMoreInfo" />
      </h2>
    </component>
    <p v-if="props.help" v-html="props.help" />
  </div>
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
