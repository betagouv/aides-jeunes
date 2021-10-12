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
    <small v-if="situationID"
      >Cette simulation a pour identifiant
      <span class="preformatted">{{ situationID }}</span> (en savoir plus sur
      <router-link to="/confidentialite"
        >le traitement de vos données personnelles</router-link
      >).</small
    ><br />
    <small v-if="situationID">
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
    <a
      href="https://voxusagers.numerique.gouv.fr/Demarches/3135?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=b4053638f7a51e868dea83f4361ebc23"
      class="aj-cta-avis"
      @click="trackEvent"
      target="_blank"
    >
      <img
        src="https://voxusagers.numerique.gouv.fr/static/bouton-bleu.svg"
        alt="Je donne mon avis"
      />
    </a>
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
  props: {
    situationID: String,
  },
  data: function () {
    return {
      openfiscaTracerURL: false,
      openfiscaAxeURL: false,
      PNDSURL: false,
      showExpertLinks: false,
    }
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
      return sendEcartSimulation(this.situationID)
    },
    sendMailEcartInstruction() {
      return sendEcartInstructions(this.situationID)
    },
    sendMailSuggestion() {
      return sendSuggestion(this.situationID)
    },
    trackEvent: function () {
      this.$matomo && this.$matomo.trackEvent("Parcours", "Je donne mon avis")
    },
  },
}
</script>
