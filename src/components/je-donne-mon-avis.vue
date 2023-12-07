<template>
  <a
    v-analytics="jeDonneMonAvisEvent"
    class="fr-pt-2v"
    :href="feedbackLink"
    target="_blank"
    >Je donne mon avis</a
  >
</template>
<script setup lang="ts">
import { ref } from "vue"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import { useRoute } from "vue-router"

const feedbackLink = ref(
  "https://jedonnemonavis.numerique.gouv.fr/Demarches/3760?&view-mode=formulaire-avis&nd_source=button&key=b4053638f7a51e868dea83f4361ebc23"
)
const jeDonneMonAvisEvent = {
  action: EventAction.JeDonneMonAvis,
  category: EventCategory.Parcours,
  name: useRoute().path,
}
</script>
