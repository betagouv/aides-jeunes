<template>
  <LoadingModal> Récupération de vos informations en cours… </LoadingModal>
</template>

<script lang="ts">
import axios from "axios"
import * as Sentry from "@sentry/vue"

import LoadingModal from "@/components/loading-modal.vue"

export default {
  name: "FranceConnectCallback",
  components: {
    LoadingModal,
  },
  async mounted() {
    const search = new URLSearchParams(this.$route.query)
    if (!search.has("code")) {
      return
    }
    const code = search.get("code")
    const state = search.get("state")
    let simulation = null

    try {
      const response = await axios.get(
        `/api/france-connect/callback?code=${code}&state=${state}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      simulation = response.data.simulation
    } catch (error) {
      Sentry.captureException(error)
      return this.$router.push({
        path: "/simulation/individu/demandeur/date_naissance",
        query: { error: "france_connect_error" },
      })
    }

    // Redirection through `$router` is not working here, `document.location` is used instead
    document.location = `/api/simulation/${simulation._id}/redirect?token=${simulation.token}`
  },
}
</script>
