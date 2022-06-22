<template>
  <div>
    <h1>Liste des questions</h1>
    <div> {{ JSON.stringify(questions) }} </div>
  </div>
</template>

<script lang="ts" setup>
import { generateAllSteps } from "../../lib/state/generator"
import { SIMPLE_STEPS } from "@/lib/recapitulatif"
import { ENTITIES_PROPERTIES } from "../../lib/mutualized-steps"
import SimpleProperties from "../../lib/properties/others/simple-properties"
import { useIndividu } from "@/composables/individu"
import { datesGenerator } from "../../lib/benefits/compute"
import moment from "moment"
import { useStore } from "vuex"
import { Property } from "../../lib/properties/property"

const store = useStore()

const steps = generateAllSteps(
  {
    individus: {
      demandeur: {},
      conjoint: {},
    },
    menage: {},
  },
  store.state.openFiscaParameters
)
const periods = datesGenerator(moment().format())
const propertyData = {
  openFiscaParameters: store.state.openFiscaParameters,
  simulation: store.state.simulation,
  periods: periods,
}

function questionsPerStep(step) {
  let result: any = {
    id: step.variable,
    entity: step.entity,
    url: step.url,
  }

  // if (SIMPLE_STEPS[step.variable]) {
  //   return []
  // return SIMPLE_STEPS[step.variable]
  //   .bind(this)(step)
  //   .map((question) => {
  //     return [{
  //       question: question.label,
  //     }]
  //   })
  // }

  const property =
    ENTITIES_PROPERTIES[step.entity]?.[step.variable] ||
    SimpleProperties[step.variable]

  if (property) {
    const individu =
      step.entity === "individu" ? useIndividu(step.id) : undefined

    const currentPropertyData = {
      ...propertyData,
      individu,
    }
    result = { ...result, ...property.getFormat(currentPropertyData) }
    return [result]
  }
  return []
}

const questions = steps.reduce((accum, step) => {
  const result = questionsPerStep(step)
  accum.push(...result)
  return accum
}, [])
</script>
