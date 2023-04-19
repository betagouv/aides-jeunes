<template>
  <div> </div>
</template>

<script>
import axios from "axios"

export default {
  name: "Callback",
  async mounted() {
    const search = new URLSearchParams(document.location.search)
    if (!search.has("code")) {
      return
    }
    const code = search.get("code")
    const response = await axios.get(`/api/auth/callback?code=${code}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    document.location = `/api/simulation/${response.data.simulation._id}/redirect?token=${response.data.simulation.token}`
  },
}
</script>
