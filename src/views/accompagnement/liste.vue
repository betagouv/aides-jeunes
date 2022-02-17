<template>
  <article class="text container aj-text-container">
    <h1>Suivis des utilisateurs</h1>
    <router-link
      v-if="followupId"
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
    <a v-if="!loggedIn" :href="connect()" class="button outline is-not-mobile"
      >Se connecter</a
    >
    <div v-if="accompagnements.length">
      <div v-for="accompagnement in accompagnements" :key="accompagnement._id">
        <div
          v-for="survey in accompagnement.surveys"
          :key="survey._id"
          class="accompagnement"
        >
          <div class="survey-answer">
            <div
              >{{ accompagnement.email }} -
              {{ formatDate(survey.repliedAt) }}</div
            >
            <router-link :to="`/accompagnement/${accompagnement._id}`"
              >Permalink</router-link
            >
            <a :href="`mailto:${accompagnement.email}`">Recontacter</a>
          </div>
          <ul
            v-for="answer in accompagnement.benefits"
            :key="answer.id"
            class="answers-list"
          >
            <li class="survey-answer">
              <div :class="`icon-${answer.status}`">{{ answer.status }}</div>
              <a :href="`/aides/${answer.id}`" target="_blank">{{
                answer.id
              }}</a>
              <b v-if="answer.unit && !isNaN(answer.amount)"
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
export default {
  data: function () {
    return {
      accompagnements: this.fetchPollResults(),
      loggedIn: true,
    }
  },
  computed: {
    followupId() {
      return this.$route.params.followupId
    },
  },
  methods: {
    connect() {
      return `/api/auth/redirect?redirect=${window.location}`
    },
    formatDate(date) {
      let isoDateTime = new Date(date)
      return `${isoDateTime.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} à ${isoDateTime.toLocaleTimeString("fr-FR")}`
    },

    fetchPollResults: async function () {
      this.retrievingCommunes = true
      const uri = this.$route.params.followupId
        ? `/api/followups/id/${this.$route.params.followupId}`
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
            benefit["status"] = surveyStates[benefit["id"]]["status"]
            benefit["comments"] = surveyStates[benefit["id"]]["comments"]
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

.icon-asked,
.icon-failed,
.icon-nothing,
.icon-already {
  display: block;
  width: 20px;
  height: 20px;
  font-size: 0;
  border-radius: 50%;
  border: 2px solid hsl(165, 30%, 57%);
  position: relative;
  user-select: none;

  position: relative;
}
.icon-failed {
  border: 2px solid hsl(350, 30%, 57%);
}
.icon-nothing {
  border: 2px solid hsl(40, 30%, 57%);
}
.icon-already {
  border: 2px solid hsl(200, 30%, 57%);
}

.icon-asked:after,
.icon-failed:before,
.icon-failed:after,
.icon-nothing:before,
.icon-nothing:after,
.icon-already:before,
.icon-already:after {
  display: block;
  content: "";
  margin: auto;
  position: absolute;
  inset: 0;
}
.icon-asked:after {
  width: 8px;
  height: 5px;
  border-bottom: 2px solid hsl(165, 30%, 57%);
  border-left: 2px solid hsl(165, 30%, 57%);
  bottom: 3px;
  transform: rotate(-45deg);
}
.icon-failed:before,
.icon-failed:after {
  width: 10px;
  height: 2px;
  background-color: hsl(350, 30%, 57%);
  transform: rotate(45deg);
}
.icon-failed:after {
  transform: rotate(-45deg);
}

.icon-nothing:before,
.icon-nothing:after,
.icon-already:before,
.icon-already:after {
  width: 2px;
  height: 8px;
  inset: 6px 0 auto 0;
  background-color: hsl(40, 30%, 57%);
}
.icon-nothing:after {
  height: 2px;
  inset: auto 0 12px 0;
}

.icon-already:before {
  background-color: hsl(200, 30%, 57%);
  inset: auto 0 6px 0;
}
.icon-already:after {
  background-color: hsl(200, 30%, 57%);
  height: 2px;
  inset: auto 0 2px 0;
}
</style>
