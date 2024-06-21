<script setup lang="ts">
import axios from "axios"
import { useStore } from "@/stores/index.js"
import { computed } from "vue"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventCategory, EventAction } from "@lib/enums/event.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

const props = defineProps({
  benefit: {
    type: Object,
    required: true,
  },
})

const store = useStore()

const simulationId = computed(
  () => !store.calculs.dirty && store.calculs.resultats?._id
)

StatisticsMixin.methods.sendEventToMatomo(
  EventCategory.Followup,
  EventAction.FormulaireAffiche,
  ABTestingService.getValues().CTA_EmailRecontact
)

const action = () => {
  sendSimulationResultsByEmail()
  store.setModalState(undefined)
  window.open(props.benefit.teleserviceSupport, "_blank")
}

const sendSimulationResultsByEmail = async () => {
  console.log("sendSimulationResultsByEmail", simulationId.value)
  //   // TODO: uncomment when email service is ready
  //   // const uri = `/api/email/simulation/${simulationId.value}`
  //   // const payload = {
  //   // email: props.benefit.mailSupport,
  //   // }
  //   // return await axios.post(uri, payload)
}
</script>

<template>
  <div class="fr-modal__content">
    <p>
      Vous allez prendre un rendez-vous téléphonique avec le CCAS
      d’Aubervilliers. <br /><br />
      En poursuivant, le résultat de votre simulation sera transmis à l’agent du
      CCAS qui vous recevra en rendez-vous téléphonique.
    </p>
  </div>
  <div class="fr-modal__footer">
    <ul class="fr-btns-group">
      <li>
        <button class="fr-btn" @click="action">
          J'accepte les conditions et je réserve mon rendez-vous
        </button>
      </li>
    </ul>
  </div>
</template>
