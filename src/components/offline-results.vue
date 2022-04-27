<template>
  <div v-if="show" class="aj-offline-results">
    <h2 class="aj-question"> Je garde ces informations&nbsp;! </h2>
    <span>
      Vous pouvez enregistrer les résultats de votre simulation pour les
      consulter plus tard.
    </span>
    <div class="aj-offline-results-button">
      <SendRecapEmailButton class="primary"></SendRecapEmailButton>
    </div>
    <RecapEmailModal :id="id"></RecapEmailModal>
  </div>
</template>

<script>
import RecapEmailModal from "@/components/modals/recap-email-modal"
import SendRecapEmailButton from "@/components/buttons/send-recap-email-button"

export default {
  name: "OfflineResults",
  components: {
    RecapEmailModal,
    SendRecapEmailButton,
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
