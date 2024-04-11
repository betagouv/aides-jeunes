<script setup lang="ts">
import DroitsDetails from "@/components/droits-details.vue"
import { onMounted, ref } from "vue"

const benefit = ref()

onMounted(() => {
  let gristScript = document.createElement("script")
  gristScript.setAttribute(
    "src",
    "https://grist.incubateur.net/grist-plugin-api.js"
  )
  document.head.appendChild(gristScript)
  addEventListener(
    "load",
    () => {
      window.grist.ready()
      window.grist.onRecord(function (record) {
        benefit.value = {
          ...record,
          institution: {
            label: record.institution,
          },
        }
      })
    },
    { once: true }
  )
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
