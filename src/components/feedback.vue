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
    <ul :key="`${situationId}-${droits?.length}`">
      <li>
        <a
          v-analytics="{
            name: 'Suggestion',
            action: 'Support',
            category: 'General',
          }"
          v-mail="sendMailSuggestion"
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
          v-mail="sendMailEcartSimulation"
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
          v-mail="sendMailEcartInstruction"
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
              title="Accédez à l'outil d'analyse des résultats de cette simulation - Nouvelle fenêtre"
              >Accédez à l'outil d'analyse des résultats de cette simulation</a
            >
          </li>
          <li v-if="openfiscaAxeURL">
            <a
              v-analytics="{ category: 'Axe' }"
              target="_blank"
              :href="openfiscaAxeURL"
              title="Analysez l'évolution des aides en fonction des ressources : graphique - Nouvelle fenêtre"
              >Analysez l'évolution des aides en fonction des ressources
            </a>
          </li>
          <li v-if="PNDSURL">
            <a
              v-analytics="{ category: 'PNDS' }"
              target="_blank"
              :href="PNDSURL"
              title="Transférer les données au PNDS :  - Nouvelle fenêtre"
              >Transférer les données au PNDS
            </a>
          </li>
        </ul>
      </div>
    </small>
    <a
      v-analytics="{
        action: 'Parcours',
        category: 'Je donne mon avis',
      }"
      href="https://voxusagers.numerique.gouv.fr/Demarches/3135?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=b4053638f7a51e868dea83f4361ebc23"
      class="aj-cta-avis"
      target="_blank"
      title="Je donne mon avis - Nouvelle fenêtre"
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
import { useStore } from "@/stores"
import { useRoute } from "vue-router"
import { formatDroitEstime } from "@lib/benefits/details.js"
import { capitalize } from "@lib/utils.js"

export default {
  name: "Feedback",
  setup() {
    return {
      route: useRoute(),
      store: useStore(),
    }
  },
  data() {
    return {
      openfiscaTracerURL: false,
      openfiscaAxeURL: false,
      PNDSURL: false,
      showExpertLinks: false,
    }
  },
  computed: {
    droits() {
      const droitId = this.route.params.droitId
      const droits = droitId
        ? this.store.calculs.resultats.droitsEligibles.filter(
            (droit) => droit.id === this.route.params.droitId
          )
        : this.store.calculs.resultats.droitsEligibles

      return droits?.map((droit) => this.formatDroit(droit))
    },
    situationId() {
      return this.store.situationId
    },
    sendMailEcartSimulation() {
      return sendEcartSimulation(this.situationId, this.droits)
    },
    sendMailEcartInstruction() {
      return sendEcartInstructions(this.situationId, this.droits)
    },
    sendMailSuggestion() {
      return sendSuggestion(this.situationId)
    },
  },
  methods: {
    formatDroit(droit) {
      const droitEstime = formatDroitEstime(
        droit,
        this.store.openFiscaParameters
      )
      const benefitLabel = capitalize(droit.label)
      const amount = `${droitEstime.value}${
        droitEstime.legend ? ` ${droitEstime.legend}` : ""
      }`
      return {
        label: benefitLabel,
        amount: amount,
      }
    },
    toggleLinks() {
      if (!this.openfiscaTracerURL) {
        this.store
          .fetchRepresentation("openfisca_tracer")
          .then((representation) => {
            this.openfiscaTracerURL = representation.destination.url
          })

        this.store
          .fetchRepresentation("openfisca_axe")
          .then((representation) => {
            this.openfiscaAxeURL = representation.destination.url
          })

        this.store.fetchRepresentation("PNDS").then((representation) => {
          this.PNDSURL = representation.destination.url
        })
      }
      this.showExpertLinks = !this.showExpertLinks
    },
  },
}
</script>
