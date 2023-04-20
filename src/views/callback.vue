<template>
  <LoadingModal> Récupération de vos informations en cours… </LoadingModal>
</template>

<script>
import axios from "axios"

import LoadingModal from "@/components/loading-modal.vue"

export default {
  name: "Callback",
  components: {
    LoadingModal,
  },
  async mounted() {
    const search = new URLSearchParams(document.location.search)
    if (!search.has("code")) {
      return
    }
    const code = search.get("code")
    const state = search.get("state")
    const response = await axios.get(
      `/api/auth/callback?code=${code}&state=${state}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    document.location = `/api/simulation/${response.data.simulation._id}/redirect?token=${response.data.simulation.token}`
  },
}
</script>
