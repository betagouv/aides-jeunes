<template>
  <article class="fr-article">
    <h1>Suivis des utilisateurs</h1>

    <router-link
      v-if="surveyId && loggedIn"
      class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-arrow-left-line fr-mb-3w"
      to="/accompagnement"
      >Retour à la liste des suivis</router-link
    >
    <a
      v-if="loggedIn === false"
      :href="connect"
      class="fr-btn fr-btn--secondary"
      >Se connecter</a
    >

    <SimulationSearch v-if="loggedIn" />

    <div v-if="loggedIn && accompagnements">
      <div class="fr-text--lead fr-mt-5w fr-mb-1w">Réponses au sondage</div>
      <div class="fr-legend fr-mb-3w">
        <span
          class="fr-icon-success-line"
          style="color: var(--text-default-success)"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-1w fr-mr-2w">Demande réussie</span>
        <span
          class="fr-icon-error-line"
          style="color: var(--text-default-error)"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-1w fr-mr-2w">Demande échouée</span>
        <span
          class="fr-icon-warning-line"
          style="color: var(--background-action-high-yellow-tournesol)"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-1w fr-mr-2w">Aucune demande</span>
        <span
          class="fr-icon-info-line"
          style="color: var(--text-default-info)"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-1w fr-mr-2w">Déjà perçue</span>
      </div>
      <div v-for="accompagnement in accompagnements" :key="accompagnement._id">
        <div
          v-for="survey in accompagnement.surveys"
          :key="survey._id"
          class="fr-p-2w fr-mb-2w"
          style="background: var(--background-alt-grey); border-radius: 0.4rem"
        >
          <div class="aj-flex-row fr-mb-2w">
            <a :href="`mailto:${accompagnement.email}`">{{
              accompagnement.email
            }}</a>
            <span class="fr-tag">
              Sondage le {{ formatDate(survey.repliedAt) }}
            </span>
            <span class="fr-tag">
              Simulation le {{ formatDate(accompagnement.createdAt) }}
            </span>
            <router-link :to="`/accompagnement/${accompagnement._id}`"
              >Permalink</router-link
            >
            <a
              :href="`/api/support/simulation/${accompagnement.simulation}`"
              target="_blank"
              >Résultats de la simulation</a
            >
            <CopyButton
              :benefitsMap="benefitsMap"
              :benefitsList="accompagnement.benefits"
            />
          </div>
          <ul
            v-for="answer in accompagnement.benefits"
            :key="answer.id"
            class="fr-toggle__list"
          >
            <li class="fr-mb-2w aj-flex-row">
              <span
                v-if="answer.status == 'asked'"
                class="fr-icon-success-line"
                style="color: var(--text-default-success)"
                aria-hidden="true"
              ></span>
              <span
                v-if="answer.status == 'failed'"
                class="fr-icon-error-line"
                style="color: var(--text-default-error)"
                aria-hidden="true"
              ></span>
              <span
                v-if="answer.status == 'nothing'"
                class="fr-icon-warning-line"
                style="color: var(--background-action-high-yellow-tournesol)"
                aria-hidden="true"
              ></span>
              <span
                v-if="answer.status == 'already'"
                class="fr-icon-info-line"
                style="color: var(--text-default-info)"
                aria-hidden="true"
              ></span>

              <a
                :href="`/aides/${answer.id}`"
                target="_blank"
                :title="answer.id"
                >{{ benefitsMap(answer.id)?.label || answer.id }}</a
              >
              <b v-if="answer.unit && typeof answer.amount === `number`"
                >({{ Math.round(answer.amount * 100) / 100
                }}{{ answer.unit }})</b
              >
              <div v-if="answer.comments">{{ answer.comments }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import SimulationSearch from "@/components/support/simulation-search.vue"
import CopyButton from "@/components/support/copy-button.vue"
import { getBenefit } from "@/lib/institution"
export default {
  components: { SimulationSearch, CopyButton },
  data: function () {
    return {
      benefitsMap: getBenefit,
      accompagnements: undefined,
      loggedIn: undefined,
    }
  },
  computed: {
    surveyId() {
      return this.$route.params.surveyId
    },
    connect() {
      return `/api/auth/redirect?redirect=${window.location}`
    },
  },
  watch: {
    $route: {
      immediate: true,
      async handler() {
        this.accompagnements = await this.fetchPollResults()
      },
    },
  },
  methods: {
    formatDate(date) {
      let isoDateTime = new Date(date)
      return `${isoDateTime.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })} à ${isoDateTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    },

    fetchPollResults: async function () {
      this.retrievingCommunes = true
      const uri = this.$route.params.surveyId
        ? `/api/followups/id/${this.$route.params.surveyId}`
        : `/api/followups/surveys`
      try {
        const response = await fetch(uri, {
          method: "GET",
          redirect: "error",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        const output = await response.json()
        for (let accompagnement of output) {
          const surveyStates = {}
          accompagnement.surveys[0].answers.map((survey) => {
            surveyStates[survey.id] = {
              status: survey.value,
              comments: survey.comments,
            }
          })
          accompagnement.benefits.map((benefit) => {
            if (benefit.id && surveyStates[benefit.id]) {
              benefit["status"] = surveyStates[benefit["id"]]["status"]
              benefit["comments"] = surveyStates[benefit["id"]]["comments"]
            }
          })
        }
        this.accompagnements = output
        this.loggedIn = true
      } catch (status) {
        this.accompagnements = []
        this.loggedIn = false
      }
      return this.accompagnements
    },
  },
}
</script>
