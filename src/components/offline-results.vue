<template>
  <div v-if="show" class="aj-offline-results">
    <h2 class="aj-question"> Je garde ces informations&nbsp;! </h2>
    <span>
      Vous pouvez enregistrer les résultats de votre simulation pour les
      consulter plus tard.
    </span>
    <div class="aj-offline-results-button">
      <SendRecapEmailButton class="primary"></SendRecapEmailButton><br />
      <DownloadResultsButton :id="id"></DownloadResultsButton>
    </div>
    <RecapEmailModal :id="id"></RecapEmailModal>
  </div>
</template>

<script>
import RecapEmailModal from "@/components/modals/recap-email-modal"
import SendRecapEmailButton from "@/components/buttons/send-recap-email-button"
import DownloadResultsButton from "@/components/buttons/download-results-email-button"

export default {
  name: "OfflineResults",
  components: {
    RecapEmailModal,
    SendRecapEmailButton,
    DownloadResultsButton,
  },
  props: {
    id: String,
  },
  computed: {
    show() {
      return this.$store.state.recapEmailState !== "ok"
    },
  },
}
</script>
