<template>
  <article class="text container aj-text-container">
    <h1>Suivi des utilisateurs</h1>
    <div
      v-if="this.accompagnements.length"
      v-for="accompagnement in this.accompagnements"
    >
      <div v-for="survey in accompagnement.surveys" class="accompagnement">
        <div class="survey-answer">
          <div
            >{{ accompagnement.email }} -
            {{ formatDate(survey.repliedAt) }}</div
          >
          <a :href="`/accompagnement/${accompagnement._id}`">Permalink</a>
          <a :href="`mailto:${accompagnement.email}`">Recontacter</a>
        </div>
        <ul v-for="answer in accompagnement.benefits" class="answers-list">
          <li class="survey-answer">
            <div :class="`icon-${answer.status}`">{{ answer.status }}</div>
            <a :href="`/aides/${answer.id}`" target="_blank">{{ answer.id }}</a>
            <b v-if="answer.unit && !isNaN(answer.amount)"
              >({{ answer.amount }}{{ answer.unit }})</b
            >
            <div v-if="answer.comments">{{ answer.comments }}</div>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script>
import axios from "axios"

export default {
  data: function () {
    return {
      accompagnements: this.fetchPollResults(),
    }
  },
  methods: {
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
      const uri = `/api/followups/surveys`
      var result = []
      await axios
        .get(uri)
        .then((result) => {
          const output = result.data
          for (let accompagnement of output) {
            console.log(accompagnement.surveys[0])
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
        })
        .catch(() => {
          console.error(result)
          this.accompagnements = []
        })
      return this.accompagnements
    },
  },
}
</script>
<style scoped>
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
.icon-already,
.icon-progress {
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
.icon-progress {
  border: 2px solid hsl(265, 30%, 57%);
}

.icon-asked:after,
.icon-failed:before,
.icon-failed:after,
.icon-nothing:before,
.icon-nothing:after,
.icon-already:before,
.icon-already:after,
.icon-progress:before,
.icon-progress:after {
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
  bottom: 2px;
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

.icon-progress:after {
  width: 6px;
  height: 8px;
  border-bottom: 2px solid hsl(265, 30%, 57%);
  border-left: 2px solid hsl(265, 30%, 57%);
  margin: 2px 8px;
}
</style>
