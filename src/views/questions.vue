<template>
  <div>
    <h1>Liste des questions</h1>
    <div v-for="question in questions" :key="question" v-html="question"> </div>
  </div>
</template>

<script>
import { generateAllSteps } from "../../lib/state/generator"
import { SIMPLE_STEPS } from "@/lib/recapitulatif"
import { ENTITIES_PROPERTIES } from "../../lib/mutualized-steps"
import { useIndividu } from "@/composables/individu"
import { capitalize, executeFunctionOrReturnValue } from "../../lib/utils"
import { datesGenerator } from "../../lib/benefits/compute"
import moment from "moment"

export default {
  name: "Recapitulatif",
  data() {
    const steps = generateAllSteps(
      {
        individus: {
          demandeur: {},
        },
        menage: {},
      },
      this.$store.state.openFiscaParameters
    )
    const periods = datesGenerator(moment().format())
    return {
      steps,
      propertyData: {
        openFiscaParameters: this.$store.state.openFiscaParameters,
        simulation: this.$store.state.simulation,
        periods: periods,
      },
    }
  },
  computed: {
    questions() {
      return this.steps.reduce((accum, step) => {
        const result = this.questionsPerStep(step)
        accum.push(...result)
        return accum
      }, [])
    },
  },
  methods: {
    questionsPerStep(step) {
      if (SIMPLE_STEPS[step.variable]) {
        return SIMPLE_STEPS[step.variable]
          .bind(this)(step)
          .map((question) => question.label)
      }

      if (ENTITIES_PROPERTIES[step.entity]) {
        const individu =
          step.entity === "individu" ? useIndividu(step.id) : undefined

        const question = executeFunctionOrReturnValue(
          ENTITIES_PROPERTIES[step.entity][step.variable],
          "question",
          {
            ...this.propertyData,
            individu,
          }
        )
        return [capitalize(question || "")]
      }
      return []
    },
  },
}
</script>
