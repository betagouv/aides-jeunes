<template>
  <article class="fr-article">
    <h1>Suivis des utilisateurs</h1>

    <router-link
      v-if="(followupId || surveyEmail) && loggedIn"
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

    <div
      v-if="loggedIn && accompagnements && accompagnements.length > 1"
      class="fr-container fr-px-0 fr-mb-0 fr-py-2w"
    >
      <div class="fr-grid-row fr-grid-row--gutters">
        <SimulationSearch class="fr-col-6" />
        <SurveyEmailSearch class="fr-col-6" />
      </div>
    </div>
    <WarningMessage v-if="loggedIn && error">{{ error }}</WarningMessage>
    <div v-if="loggedIn && accompagnements">
      <div class="fr-text--lead fr-mt-5w fr-mb-1w"
        >Réponses au sondage
        <span v-if="surveyEmail"
          >pour l'utilisateur <strong>{{ surveyEmail }}</strong></span
        >
      </div>
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
          v-if="accompagnement.surveys"
          class="fr-p-2w fr-mb-2w"
          style="background: var(--background-alt-grey); border-radius: 0.4rem"
        >
          <div class="aj-flex-row fr-mb-2w">
            <a :href="`mailto:${accompagnement.email}`">{{
              accompagnement.email
            }}</a>
            <span class="fr-tag">
              Sondage le {{ formatDate(accompagnement.surveys.repliedAt) }}
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
              :followupId="accompagnement.simulation"
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
              <div v-if="answer.comments" style="flex: 1">{{
                answer.comments
              }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import SimulationSearch from "@/components/support/simulation-search.vue"
import SurveyEmailSearch from "@/components/support/survey-email-search.vue"
import CopyButton from "@/components/support/copy-button.vue"
import WarningMessage from "@/components/warning-message.vue"
import { getBenefit } from "@/lib/benefits.js"
import { FollowupLayout, SurveyType } from "@lib/types/survey.js"

export default {
  components: {
    SimulationSearch,
    SurveyEmailSearch,
    CopyButton,
    WarningMessage,
  },
  data: function () {
    return {
      benefitsMap: getBenefit,
      accompagnements: undefined,
      loggedIn: undefined,
      error: undefined,
    }
  },
  computed: {
    followupId() {
      return this.$route.params.followupId
    },
    surveyEmail() {
      return this.$route.query.surveyEmail
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
      let uri
      if (this.$route.query.surveyEmail) {
        uri = `/api/followups/email/${this.$route.query.surveyEmail}`
      } else if (this.$route.params.followupId) {
        uri = `/api/followups/id/${this.$route.params.followupId}`
      } else {
        uri = `/api/followups/surveys`
      }
      try {
        const response = await fetch(uri, {
          method: "GET",
          redirect: "error",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        this.error = undefined
        this.loggedIn = true

        if (response.status == 404) {
          this.error = `Aucun sondage ne correspond à ${
            this.$route.params.surveyEmail
              ? "cette adresse email"
              : "cet identifiant"
          }`
        } else {
          const accompagnements: FollowupLayout[] = await response.json()
          this.accompagnements = accompagnements
            .map((accompagnement) => {
              accompagnement.surveys = accompagnement.surveys.filter(
                (survey) =>
                  survey.type === SurveyType.benefitAction &&
                  survey.answers.length
              )
              return accompagnement
            })
            .filter(({ surveys }) => surveys.length)
          this.accompagnements.forEach(({ surveys, benefits }) => {
            const surveyStates = {}
            console.log(surveys[0].answers)
            surveys[0].answers.forEach(({ id, value, comments }) => {
              surveyStates[id] = { status: value, comments }
            })
            benefits.forEach((benefit) => {
              if (benefit.id && surveyStates[benefit.id]) {
                benefit.status = surveyStates[benefit.id].status
                benefit.comments = surveyStates[benefit.id].comments
              }
            })
          })
        }
      } catch (status) {
        this.accompagnements = []
        this.loggedIn = false
      }
      return this.accompagnements
    },
  },
}
</script>
