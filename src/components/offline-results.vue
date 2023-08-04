<template>
  <div v-if="show">
    <h2 class="fr-text--lead"> Je garde ces informations&nbsp;! </h2>
    <p>
      Vous pouvez enregistrer les résultats de votre simulation pour les
      consulter plus tard.
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-xs">
      <li>
        <SendRecapEmailButton class="primary"></SendRecapEmailButton>
      </li>
    </ul>
    <RecapEmailModal :id="id"></RecapEmailModal>
  </div>
</template>

<script lang="ts">
import RecapEmailModal from "@/components/modals/recap-email-modal.vue"
import SendRecapEmailButton from "@/components/buttons/send-recap-email-button.vue"
import { useStore } from "@/stores/index.js"

export default {
  name: "OfflineResults",
  components: {
    RecapEmailModal,
    SendRecapEmailButton,
  },
  props: {
    id: String,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    show() {
      return this.store.recapEmailState !== "ok"
    },
  },
}
</script>
