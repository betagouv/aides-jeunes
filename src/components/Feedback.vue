<template>
  <div class="aj-feedback">
    <h2 class="aj-question">
      Nous améliorons ce simulateur en continu, et vous pouvez nous y
      aider&nbsp;!
    </h2>
    <p>
      La plupart des résultats que nous vous proposons sont automatiquement
      arrondis à une dizaine d'euros près.
    </p>
    <ul>
      <li>
        <a
          v-analytics="{
            name: 'Suggestion',
            action: 'Support',
            category: 'General',
          }"
          v-mail="this.sendMailSuggestion()"
          >Vous avez une suggestion d'amélioration</a
        >.
      </li>
      <li>
        <a
          v-analytics="{
            name: 'Écart simulation',
            action: 'Support',
            category: 'General',
          }"
          v-mail="this.sendMailEcartSimulation()"
          >Ces résultats ne correspondent pas à ceux d'un autre simulateur</a
        >.
      </li>
      <li>
        <a
          v-analytics="{
            name: 'Écart instruction',
            action: 'Support',
            category: 'General',
          }"
          v-mail="this.sendMailEcartInstruction()"
          >Ces résultats ne correspondent pas à ce que l'administration vous a
          attribué</a
        >.
      </li>
    </ul>
    <small v-if="situationId"
      >Cette simulation a pour identifiant
      <span class="preformatted">{{ situationId }}</span> (en savoir plus sur
      <router-link to="/confidentialite"
        >le traitement de vos données personnelles</router-link
      >).</small
    ><br />
    <small v-if="situationId">
      <button v-if="!showExpertLinks" class="button small" @click="toggleLinks">
        Je suis partenaire
      </button>
      <div v-if="showExpertLinks" class="aj-feedback-partenaire">
        Je suis partenaire&nbsp;:
        <ul>
          <li>
            <router-link :to="{ name: 'resultatsAttendus' }"
              >Indiquez les résultats attendus pour cette situation
            </router-link>
          </li>
          <li v-if="openfiscaTracerURL">
            <a
              v-analytics="{ category: 'Tracer' }"
              target="_blank"
              :href="openfiscaTracerURL"
              >Accédez à l'outil d'analyse des résultats de cette simulation</a
            >
          </li>
          <li v-if="openfiscaAxeURL">
            <a
              v-analytics="{ category: 'Axe' }"
              target="_blank"
              :href="openfiscaAxeURL"
              >Analysez l'évolution des aides en fonction des ressources
            </a>
          </li>
          <li v-if="PNDSURL">
            <a
              v-analytics="{ category: 'PNDS' }"
              target="_blank"
              :href="PNDSURL"
              >Transférer les données au PNDS
            </a>
          </li>
        </ul>
      </div>
    </small>
  </div>
</template>
<script>
import {
  sendEcartSimulation,
  sendEcartInstructions,
  sendSuggestion,
} from "@/plugins/mails"

export default {
  name: "Feedback",
  data: function () {
    return {
      openfiscaTracerURL: false,
      openfiscaAxeURL: false,
      PNDSURL: false,
      showExpertLinks: false,
    }
  },
  computed: {
    situationId: function () {
      return this.$store.state.situationId
    },
  },
  methods: {
    toggleLinks: function () {
      if (!this.openfiscaTracerURL) {
        this.$store.getters
          .fetchRepresentation("openfisca_tracer")
          .then((representation) => {
            this.openfiscaTracerURL = representation.destination.url
          })

        this.$store.getters
          .fetchRepresentation("openfisca_axe")
          .then((representation) => {
            this.openfiscaAxeURL = representation.destination.url
          })

        this.$store.getters
          .fetchRepresentation("PNDS")
          .then((representation) => {
            this.PNDSURL = representation.destination.url
          })
      }
      this.showExpertLinks = !this.showExpertLinks
    },
    sendMailEcartSimulation() {
      return sendEcartSimulation(this.situationId)
    },
    sendMailEcartInstruction() {
      return sendEcartInstructions(this.situationId)
    },
    sendMailSuggestion() {
      return sendSuggestion(this.situationId)
    },
  },
}
</script>
