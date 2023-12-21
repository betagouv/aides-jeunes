<script setup lang="ts">
import { computed, defineProps } from "vue"
import { StandardBenefit } from "@data/types/benefits"
import BenefitPreview from "@/components/benefit-preview.vue"

const props = defineProps({
  benefits: Array<StandardBenefit>,
  filter: Array<any>,
})

const list: any = computed(() => {
  return props.benefits?.filter((value: any) => {
    return !props.filter || props.filter.includes(value.id)
  })
})
</script>

<template>
  <div v-for="(benefit, index) in list" :key="index" class="fr-mb-5w">
    <BenefitPreview :benefit="benefit" />
  </div>
</template>
