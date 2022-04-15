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

    <div v-if="accompagnements">
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
          </div>
          <ul
            v-for="answer in accompagnement.benefits"
            :key="answer.id"
            class="answers-list"
          >
            <li class="survey-answer">
              <div class="icon">
                <svg
                  v-if="answer.status == 'asked'"
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="m60,112c-28.72928,0 -52,-23.27072 -52,-52c0,-28.72928 23.27072,-52 52,-52c28.72928,0 52,23.27072 52,52c0,28.72928 -23.27072,52 -52,52z"
                      stroke-width="10"
                      stroke="#70b2a2"
                      fill="none"
                    />
                    <line
                      stroke="#70b2a2"
                      y2="39.73677"
                      x2="91.26323"
                      y1="82.26323"
                      x1="48.73677"
                      stroke-width="10"
                      fill="none"
                    />
                    <path
                      transform="rotate(-90, 42, 68.5)"
                      d="m28.23677,81.76322l27.52646,-26.52646"
                      opacity="undefined"
                      stroke-width="10"
                      stroke="#70b2a2"
                      fill="none"
                    />
                  </g>
                </svg>

                <svg
                  v-if="answer.status == 'already'"
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      fill="none"
                      stroke="#709cb2"
                      stroke-width="10"
                      d="m60,112c-28.72928,0 -52,-23.27072 -52,-52c0,-28.72928 23.27072,-52 52,-52c28.72928,0 52,23.27072 52,52c0,28.72928 -23.27072,52 -52,52z"
                    />
                    <line
                      transform="rotate(-45, 60, 72)"
                      fill="none"
                      stroke-width="10"
                      x1="42.2723"
                      y1="89.7277"
                      x2="77.7277"
                      y2="54.2723"
                      stroke="#709cb2"
                    />
                    <line
                      y2="27"
                      x2="60"
                      y1="37"
                      x1="60"
                      stroke-width="10"
                      stroke="#709cb2"
                      fill="none"
                    />
                  </g>
                </svg>

                <svg
                  v-if="answer.status == 'nothing'"
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <g transform="rotate(180, 60, 60)">
                      <path
                        d="m60,112c-28.72928,0 -52,-23.27072 -52,-52c0,-28.72928 23.27072,-52 52,-52c28.72928,0 52,23.27072 52,52c0,28.72928 -23.27072,52 -52,52z"
                        stroke-width="10"
                        stroke="#b29c70"
                        fill="none"
                      />
                      <line
                        stroke="#b29c70"
                        y2="54.2723"
                        x2="77.7277"
                        y1="89.7277"
                        x1="42.2723"
                        stroke-width="10"
                        fill="none"
                        transform="rotate(-45, 60, 72)"
                      />
                      <line
                        fill="none"
                        stroke="#b29c70"
                        stroke-width="10"
                        x1="60"
                        y1="37"
                        x2="60"
                        y2="27"
                      />
                    </g>
                  </g>
                </svg>
                <svg
                  v-if="answer.status == 'failed'"
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style="fill: none; stroke: #b2707b; stroke-width: 10"
                    transform="rotate(-90,60,60)"
                    d="M 38.736771,81.263229 81.263229,38.736771 m -42.526458,0 42.526458,42.526458 M 60,112 A 52,52 0 0 1 8,60 52,52 0 0 1 60,8 52,52 0 0 1 112,60 52,52 0 0 1 60,112 Z"
                  />
                </svg>
              </div>
              <a
                :href="`/aides/${answer.id}`"
                target="_blank"
                :title="answer.id"
                >{{ benefitsMap[answer.id]?.label || answer.id }}</a
              >
              <b v-if="answer.unit && typeof answer.amount === `number`"
                >({{ answer.amount }}{{ answer.unit }})</b
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
import SimulationSearch from "@/components/support/simulation-search"
import Institution from "@/lib/institution"
export default {
  components: { SimulationSearch },
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
.survey-answer {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.icon {
  display: block;
  width: 20px;
  height: 20px;
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
