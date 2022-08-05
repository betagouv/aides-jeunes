<template>
  <article class="text container aj-text-container">
    <h1>Suivis des utilisateurs</h1>
    <router-link
      v-if="surveyId && loggedIn"
      to="/accompagnement"
      class="aj-droit-details-back-button button outline small with-icon"
      type="button"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-v-5ac98143=""
      >
        <path
          d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z"
          fill="#030F8F"
          data-v-5ac98143=""
        ></path>
      </svg>
      Retour à la liste des suivis
    </router-link>
    <a
      v-if="loggedIn === false"
      :href="connect"
      class="button outline is-not-mobile"
      >Se connecter</a
    >

    <SimulationSearch v-if="loggedIn" />

    <div v-if="loggedIn && accompagnements">
      <div class="aj-question">Réponses au sondage</div>
      <div class="legend">
        <div class="icon icon-asked"></div> Demande réussie
        <div class="icon icon-failed"></div> Demande échouée
        <div class="icon icon-nothing"></div> Aucune demande
        <div class="icon icon-already"></div> Déjà perçue
      </div>
      <div v-for="accompagnement in accompagnements" :key="accompagnement._id">
        <div
          v-for="survey in accompagnement.surveys"
          :key="survey._id"
          class="accompagnement"
        >
          <div class="survey-answer">
            <div>
              <a :href="`mailto:${accompagnement.email}`">{{
                accompagnement.email
              }}</a>
              -
              <span class="badge">
                Sondage le {{ formatDate(survey.repliedAt) }}
              </span>
              <span class="badge">
                Simulation le {{ formatDate(accompagnement.createdAt) }}
              </span></div
            >
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
            class="answers-list"
          >
            <li class="survey-answer">
              <div
                v-if="answer.status == 'asked'"
                class="icon icon-asked"
              ></div>
              <div
                v-if="answer.status == 'already'"
                class="icon icon-already"
              ></div>
              <div
                v-if="answer.status == 'nothing'"
                class="icon icon-nothing"
              ></div>
              <div
                v-if="answer.status == 'failed'"
                class="icon icon-failed"
              ></div>

              <a
                :href="`/aides/${answer.id}`"
                target="_blank"
                :title="answer.id"
                >{{ benefitsMap[answer.id]?.label || answer.id }}</a
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
import Institution from "@/lib/institution"
export default {
  components: { SimulationSearch, CopyButton },
  data: function () {
    return {
      benefitsMap: Institution.benefits.benefitsMap,
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
<style scoped>
.button {
  display: inline-block !important;
}
.accompagnement {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  background-color: #f9f9f9;
}
.answers-list {
  padding: 0;
}
.survey-answer,
.legend {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.legend {
  margin-bottom: 1rem;
}

.icon {
  display: block;
  width: 20px;
  height: 20px;

  background-size: 20px;
}
.icon-asked {
  background-image: url("data:image/svg+xml;base64,PHN2ZwogIHdpZHRoPSIxMjAiCiAgaGVpZ2h0PSIxMjAiCiAgdmlld0JveD0iMCAwIDEyMCAxMjAiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgo+CiAgPGc+CiAgICA8cGF0aAogICAgICBkPSJtNjAsMTEyYy0yOC43MjkyOCwwIC01MiwtMjMuMjcwNzIgLTUyLC01MmMwLC0yOC43MjkyOCAyMy4yNzA3MiwtNTIgNTIsLTUyYzI4LjcyOTI4LDAgNTIsMjMuMjcwNzIgNTIsNTJjMCwyOC43MjkyOCAtMjMuMjcwNzIsNTIgLTUyLDUyeiIKICAgICAgc3Ryb2tlLXdpZHRoPSIxMCIKICAgICAgc3Ryb2tlPSIjNzBiMmEyIgogICAgICBmaWxsPSJub25lIgogICAgLz4KICAgIDxsaW5lCiAgICAgIHN0cm9rZT0iIzcwYjJhMiIKICAgICAgeTI9IjM5LjczNjc3IgogICAgICB4Mj0iOTEuMjYzMjMiCiAgICAgIHkxPSI4Mi4yNjMyMyIKICAgICAgeDE9IjQ4LjczNjc3IgogICAgICBzdHJva2Utd2lkdGg9IjEwIgogICAgICBmaWxsPSJub25lIgogICAgLz4KICAgIDxwYXRoCiAgICAgIHRyYW5zZm9ybT0icm90YXRlKC05MCwgNDIsIDY4LjUpIgogICAgICBkPSJtMjguMjM2NzcsODEuNzYzMjJsMjcuNTI2NDYsLTI2LjUyNjQ2IgogICAgICBvcGFjaXR5PSJ1bmRlZmluZWQiCiAgICAgIHN0cm9rZS13aWR0aD0iMTAiCiAgICAgIHN0cm9rZT0iIzcwYjJhMiIKICAgICAgZmlsbD0ibm9uZSIKICAgIC8+CiAgPC9nPgo8L3N2Zz4=");
}
.icon-already {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKPiA8Zz4gPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzA5Y2IyIiBzdHJva2Utd2lkdGg9IjEwIiBkPSJtNjAsMTEyYy0yOC43MjkyOCwwIC01MiwtMjMuMjcwNzIgLTUyLC01MmMwLC0yOC43MjkyOCAyMy4yNzA3MiwtNTIgNTIsLTUyYzI4LjcyOTI4LDAgNTIsMjMuMjcwNzIgNTIsNTJjMCwyOC43MjkyOCAtMjMuMjcwNzIsNTIgLTUyLDUyeiIgLz4gPGxpbmUgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1LCA2MCwgNzIpIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEwIiB4MT0iNDIuMjcyMyIgeTE9Ijg5LjcyNzciIHgyPSI3Ny43Mjc3IiB5Mj0iNTQuMjcyMyIgc3Ryb2tlPSIjNzA5Y2IyIiAvPiA8bGluZSB5Mj0iMjciIHgyPSI2MCIgeTE9IjM3IiB4MT0iNjAiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZT0iIzcwOWNiMiIgZmlsbD0ibm9uZSIgLz4gPC9nPgo8L3N2Zz4=");
}
.icon-nothing {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKPiA8Zz4gPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTgwLCA2MCwgNjApIj4gPHBhdGggZD0ibTYwLDExMmMtMjguNzI5MjgsMCAtNTIsLTIzLjI3MDcyIC01MiwtNTJjMCwtMjguNzI5MjggMjMuMjcwNzIsLTUyIDUyLC01MmMyOC43MjkyOCwwIDUyLDIzLjI3MDcyIDUyLDUyYzAsMjguNzI5MjggLTIzLjI3MDcyLDUyIC01Miw1MnoiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZT0iI2IyOWM3MCIgZmlsbD0ibm9uZSIgLz4gPGxpbmUgc3Ryb2tlPSIjYjI5YzcwIiB5Mj0iNTQuMjcyMyIgeDI9Ijc3LjcyNzciIHkxPSI4OS43Mjc3IiB4MT0iNDIuMjcyMyIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1LCA2MCwgNzIpIiAvPiA8bGluZSBmaWxsPSJub25lIiBzdHJva2U9IiNiMjljNzAiIHN0cm9rZS13aWR0aD0iMTAiIHgxPSI2MCIgeTE9IjM3IiB4Mj0iNjAiIHkyPSIyNyIgLz4gPC9nPiA8L2c+Cjwvc3ZnPg==");
}
.icon-failed {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKPiA8cGF0aCBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlOiAjYjI3MDdiOyBzdHJva2Utd2lkdGg6IDEwIiB0cmFuc2Zvcm09InJvdGF0ZSgtOTAsNjAsNjApIiBkPSJNIDM4LjczNjc3MSw4MS4yNjMyMjkgODEuMjYzMjI5LDM4LjczNjc3MSBtIC00Mi41MjY0NTgsMCA0Mi41MjY0NTgsNDIuNTI2NDU4IE0gNjAsMTEyIEEgNTIsNTIgMCAwIDEgOCw2MCA1Miw1MiAwIDAgMSA2MCw4IDUyLDUyIDAgMCAxIDExMiw2MCA1Miw1MiAwIDAgMSA2MCwxMTIgWiIgLz4KPC9zdmc+");
}
.icon svg {
  width: 100%;
  height: 100%;
}

.badge {
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 6px;
  border-radius: 4px;
}
</style>
