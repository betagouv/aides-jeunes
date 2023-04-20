<template>
  <ProgressBar></ProgressBar>
  <div class="fr-grid-row aj-column-container">
    <div class="fr-col-12 fr-col-md-3 aj-main-container">
      <Progress v-if="debug" />
      <Summary v-else />
    </div>
    <div class="fr-col-12 fr-col-md-9 fr-p-2w">
      <TitreChapitre />
      <div v-if="debug" class="fr-mb-md-2w">
        <button class="fr-btn fr-btn--sm" @click="disableDebug"
          >Quitter le mode debug
        </button>
      </div>
      <WarningMessage v-if="store.message.text" data-testid="warning-message">
        <div v-html="store.message.text" />
      </WarningMessage>
      <div v-if="displayFranceConnect" class="fr-alert fr-alert--info fr-my-1w">
        <p>Go pour du pré-remplissage avec France Connect !</p>
        <button
          @click="franceconnect"
          class="franceconnect-button"
          href="api/auth/login"
        />
      </div>
      <div>
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
</template>

<script>
import TitreChapitre from "@/components/titre-chapitre.vue"
import Progress from "@/components/progress.vue"
import Summary from "@/components/summary.vue"
import ProgressBar from "@/components/progress-bar.vue"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.ts"

export default {
  name: "Simulation",
  components: {
    WarningMessage,
    ProgressBar,
    TitreChapitre,
    Progress,
    Summary,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      window,
    }
  },
  computed: {
    showSummary() {
      return this.$route.path !== "/simulation/recapitulatif"
    },
    debug() {
      return this.store.getDebug
    },
    displayFranceConnect() {
      return (
        this.store.getAllSteps[1].path == this.$route.path &&
        this.store.simulation.answers.all.length == 0
      )
    },
  },
  methods: {
    disableDebug() {
      this.store.setDebug(false)
      this.$router.replace({ debug: null })
    },
  },
}
</script>

<style type="text/css">
.franceconnect-button {
  width: 185px;
  height: 48px;
  background-image: url("/public/img/france-connect.svg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
