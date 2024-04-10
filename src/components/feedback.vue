<template>
  <h2 class="fr-text--lead">
    Nous améliorons ce simulateur en continu, et vous pouvez nous y aider&nbsp;!
  </h2>
  <p>
    La plupart des résultats que nous vous proposons sont automatiquement
    arrondis à une dizaine d'euros près.
  </p>
  <ul :key="`${simulationId}-${benefits?.length}`">
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
  <p
    ><small v-if="simulationId"
      >Cette simulation a pour identifiant
      <span data-testid="simulation-id">
        {{ simulationId }}
      </span>
      (en savoir plus sur
      <router-link to="/confidentialite"
        >le traitement de vos données personnelles
      </router-link>
      ).
    </small></p
  >
  <p
    ><small v-if="simulationId">
      <button
        v-if="!showExpertLinks"
        class="fr-btn fr-btn--sm"
        data-testid="partenaire-actions"
        @click="toggleLinks"
      >
        Je suis partenaire
      </button>
      <div v-if="showExpertLinks">
        <p>Je suis partenaire&nbsp;:</p>
        <ul>
          <li v-if="openfiscaTracerURL">
            <a
              v-analytics="events.tracer"
              :href="openfiscaTracerURL"
              target="_blank"
              title="Accédez à l'outil d'analyse des résultats de cette simulation - Nouvelle fenêtre"
              >Accédez à l'outil d'analyse des résultats de cette simulation</a
            >
          </li>
          <li v-if="openfiscaAxeURL">
            <a
              v-analytics="events.axe"
              :href="openfiscaAxeURL"
              target="_blank"
              title="Analysez l'évolution des aides en fonction des ressources : graphique - Nouvelle fenêtre"
              data-testid="openfisca-axe-link"
              >Analysez l'évolution des aides en fonction des ressources
            </a>
          </li>
          <li v-if="PNDSURL">
            <a
              v-analytics="events.pnds"
              :href="PNDSURL"
              target="_blank"
              title="Transférer les données au PNDS :  - Nouvelle fenêtre"
              >Transférer les données au PNDS
            </a>
          </li>
        </ul>
      </div>
    </small></p
  >
  <p class="fr-text--center"
    ><a
      v-analytics="events.jeDonneMonAvis"
      href="https://voxusagers.numerique.gouv.fr/Demarches/3135?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=b4053638f7a51e868dea83f4361ebc23"
      target="_blank"
      title="Je donne mon avis - Nouvelle fenêtre"
    >
      <img
        alt="Je donne mon avis"
        src="https://voxusagers.numerique.gouv.fr/static/bouton-bleu.svg"
      /> </a
  ></p>
</template>
<script lang="ts">
import {
  sendEcartSimulation,
  sendEcartInstructions,
  sendSuggestion,
} from "@/plugins/mails.js"
import { useStore } from "@/stores/index.js"
import { useRoute } from "vue-router"
import { formatDroitEstime } from "@lib/benefits/details.js"
import { capitalize } from "@lib/utils.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"

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
      events: {
        jeDonneMonAvis: {
          action: EventAction.JeDonneMonAvis,
          category: EventCategory.Resultats,
          name: this.$route.path,
        },
        tracer: {
          category: "Tracer",
        },
        axe: {
          category: "Axe",
        },
        pnds: {
          category: "PNDS",
        },
      },
    }
  },
  computed: {
    benefits() {
      const benefitId = this.route.params.benefitId
      const benefits = benefitId
        ? [
            this.store.calculs.resultats?.droitsEligibles?.find((droit) => {
              return droit.id === benefitId
            }),
          ]
        : this.store.calculs.resultats.droitsEligibles

      return benefits?.map((droit) => this.formatDroit(droit))
    },
    simulationId() {
      return this.store.simulationId
    },
    sendMailEcartSimulation() {
      return sendEcartSimulation(this.simulationId, this.benefits)
    },
    sendMailEcartInstruction() {
      return sendEcartInstructions(this.simulationId, this.benefits)
    },
    sendMailSuggestion() {
      return sendSuggestion(this.simulationId)
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
