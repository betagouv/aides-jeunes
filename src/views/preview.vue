<script setup lang="ts">
import DroitsDetails from "@/components/droits-details.vue"
import { ref, onMounted } from "vue"
const benefit = ref()

function check(event) {
  if (event.data.source == "decap") {
    benefit.value = event.data.value
  }
}

onMounted(() => {
  addEventListener("message", check)
  window.top?.postMessage({ source: "aides-jeunes", value: "ready" }, "*")
})
</script>

<template>
  <DroitsDetails
    v-if="benefit"
    :droit="benefit"
    :droits="[benefit]"
    :city="'75056'"
    :patrimoine-captured="true"
    :ressources-year-minus-two-captured="true"
  />
</template>
