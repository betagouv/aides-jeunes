<template>
  <article class="fr-article">
    <LoadingModal v-if="updating">
      <p>Récupération en cours…</p>
    </LoadingModal>
    <div v-else-if="error">
      <h1>Oups, une erreur est apparue</h1>
      <p>
        <a
          v-analytics="redirectionEvent"
          v-mail="{
            subject: `Problème redirection [${simulationId}]`,
            body: `Bonjour,

      ————
      ID : ${simulationId}
      Erreur : ${error}
      ————`,
          }"
          >Signalez ce problème</a
        >
      </p>
      <pre>{{ error }}</pre>
    </div>
    <div v-else>
      <h1>Transmission de vos informations</h1>
      <p>
        À titre expérimental, nous vous proposons de transmettre directement les
        informations suivantes :
      </p>

      <ul>
        <li v-for="variable in teleservice.fields" :key="variable.label">
          {{ variable.label }} :
          {{ variable.formattedValue || variable.value }}
        </li>
      </ul>

      <p>
        En continuant, vous acceptez de participer à cette expérimentation et
        que les informations saisies soient transmises.
      </p>

      <p>
        Dès lors, vous aurez un droit d'accès et de rectification sur les
        informations nominatives stockées ou traitées informatiquement. Pour
        exercer ce droit, vous devez vous y adresser, en justifiant de votre
        identité.
      </p>

      <a :href="teleservice.destination.url" class="fr-btn">{{
        teleservice.destination.label
      }}</a>
    </div>
  </article>
</template>

<script lang="ts">
import LoadingModal from "@/components/loading-modal.vue"
import { useStore } from "@/stores/index.js"
import storageService from "@/lib/storage-service.js"
import { EventAction, EventCategory } from "@lib/enums/event"

export default {
  name: "Redirection",
  components: {
    LoadingModal,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      simulationId: null,
      error: null,
      teleservice: null,
      updating: true,
      redirectionEvent: {
        action: EventAction.Support,
        category: EventCategory.Redirection,
      },
    }
  },
  mounted() {
    this.simulationId = storageService.session.getItem("simulationId")

    if (!this.simulationId) {
      this.fetchSimulationId()
    }
    if (!this.simulationId) {
      this.handleNoSimulationId()
      return
    }

    this.store
      .fetchRepresentation(this.$route.query.vers, this.simulationId)
      .then((data) => {
        this.teleservice = data
      })
      .catch((error) => {
        this.error = error
      })
      .finally(() => {
        this.updating = false
      })
  },
  methods: {
    handleNoSimulationId() {
      const route = this.$route.query.vers
      const [teleservice, procedure] = route.split("?procedure=")
      if (teleservice === "ds") {
        document.location = `https://www.demarches-simplifiees.fr/commencer/${procedure}`
      } else {
        this.error = "Identifiant de simulation absent… Arrêt."
        this.updating = false
      }
    },
    fetchSimulationId() {
      this.simulationId =
        storageService.local.getItem("trampoline")?.simulationId
      storageService.local.removeItem("trampoline")
      storageService.session.setItem("simulationId", this.simulationId)
    },
  },
}
</script>
