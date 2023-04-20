<template>
  <div v-if="data">
    <br />
    <div
      ><button @click="continueFC" class="fr-btn fr-btn--sm"
        >Continuer</button
      ></div
    >
    <br />
    <div
      ><button @click="logoutFC" class="fr-btn fr-btn--sm">Logout</button></div
    >
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
  <div v-if="!data || !!data.error">
    <router-link to="simulation/individu/demandeur/date_naissance"
      >Recommencer une simulation</router-link
    >
  </div>
</template>

<script>
import axios from "axios"
import { ref } from "vue"

export default {
  name: "Callback",
  setup() {
    return {
      data: ref({}),
    }
  },
  async mounted() {
    const search = new URLSearchParams(document.location.search)
    console.log(this.data)
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
    this.data = response.data
  },
  methods: {
    continueFC() {
      console.log("ok continue")
      alert("continue")
      document.location = `/api/simulation/${this.data.simulation._id}/redirect?token=${this.data.simulation.token}`
    },
    logoutFC() {
      document.location = "api/auth/logout"
    },
  },
}
</script>
