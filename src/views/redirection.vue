<template>
  <article class="text container">
    <p v-if="updating">
      <span
        class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
        aria-hidden="true"
      ></span
      ><span class="fr-ml-2w">Récupération en cours…</span>
    </p>
    <div v-else>
      <div v-if="error">
        <h1>Oups, une erreur est apparue</h1>
        <p>
          <a
            v-analytics="{ action: 'Support', category: 'Redirection' }"
            v-mail="{
              subject: `Problème redirection [${situationId}]`,
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
          À titre expérimental sur le territoire de Saint-Louis à la Réunion,
          Mes Aides vous propose de transmettre directement au CCAS (centre
          communal d'action sociale) les informations suivantes :
        </p>

        <ul>
          <li v-for="variable in teleservice.fields" :key="variable.label">
            {{ variable.label }} :
            {{ variable.formattedValue || variable.value }}
          </li>
        </ul>

        <p>
          En continuant, vous acceptez de participer à cette expérimentation et
          que les informations saisies soient transmises au CCAS.
        </p>

        <p>
          Dès lors, vous aurez un droit d'accès et de rectification sur les
          informations nominatives stockées ou traitées informatiquement par le
          CCAS de Saint-Louis. Pour exercer ce droit, vous devez vous y
          adresser, en justifiant de votre identité.
        </p>

        <a :href="teleservice.destination.url" class="btn btn-primary btn-lg">{{
          teleservice.destination.label
        }}</a>
      </div>
    </div>
  </article>
</template>

<script>
import { useStore } from "@/stores/index.ts"

export default {
  name: "Redirection",
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
    }
  },
  mounted() {
    this.simulationId = window.sessionStorage.getItem("simulationId")
    if (!this.simulationId) {
      this.simulationId = JSON.parse(
        window.localStorage.getItem("trampoline")
      ).simulationId
      window.localStorage.removeItem("trampoline")
      window.sessionStorage.setItem("simulationId", this.simulationId)
    }
    if (!this.simulationId) {
      this.error = "Identifiant de simulation absent… Arrêt."
      this.updating = false
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
}
</script>
