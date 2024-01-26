<template>
  <fieldset :key="type.meta.id" class="fr-fieldset fr-mb-4w">
    <legend class="fr-fieldset__legend fr-px-0">
      <span class="fr-text--lead">
        {{ type.meta.label }}
      </span>
    </legend>
    <div class="fr-fieldset__content">
      <YesNoQuestion
        :id="`${type.meta.id}_question`"
        v-model="singleValue"
        html-heading="h2"
      >
        <span
          v-html="
            getQuestionLabel(type.meta, store.dates.twelveMonthsAgo.label)
          "
        />
      </YesNoQuestion>

      <div v-if="type.displayMonthly === true">
        <label :for="`${type.meta.id}_monthly`" class="fr-label">
          Indiquez le montant <b>net social mensuel </b> :
        </label>
        <div class="fr-container fr-px-0">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
              <InputNumber
                :id="`${type.meta.id}_monthly`"
                :min="0"
                :value="type.amounts[store.dates.thisMonth.id]"
                @update:model-value="
                  $emit('update', 'singleValue', index, $event)
                "
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="type.displayMonthly === false">
        <p>
          <span class="fr-hint-text fr-mb-1w"
            >Pour faciliter la saisie des ressources sur 13 mois, lorsque un
            montant est saisi pour un mois donné, les montants pour les périodes
            précédents sont également mis à jour automatiquement. Ils peuvent
            être modifiés ensuite.</span
          >
          Indiquez les montants <strong>nets sociaux mensuels</strong> que
          {{ getLongLabel(type.individu, type.meta) }}
        </p>
        <div
          v-for="(month, monthIndex) in type.months"
          :key="month.id"
          class="fr-mt-1w"
        >
          <MonthLabel :for="`${type.meta.id}_${month.id}`" :month="month" />
          <div class="fr-container fr-px-0">
            <div class="fr-grid-row">
              <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
                <InputNumber
                  :id="`${type.meta.id}_${month.id}`"
                  :min="0"
                  :value="type.amounts[month.id]"
                  @update:model-value="
                    $emit('update', 'monthUpdate', index, {
                      value: $event,
                      monthIndex,
                    })
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue"

import MonthLabel from "@/components/month-label.vue"
import YesNoQuestion from "@/components/yes-no-question.vue"
import IndividuMethods from "@lib/individu.js"
import InputNumber from "@/components/input-number.vue"
import { useStore } from "@/stores/index.js"
import { ResourceType } from "@lib/types/resources.d.js"

const props = defineProps({
  type: { type: Object as PropType<ResourceType>, required: true },
  index: Number,
})

const emit = defineEmits(["update"])
const store = useStore()

const singleValue = computed({
  get: () => props.type.displayMonthly,
  set: (value) => emit("update", "displayMonthly", props.index, value),
})

function getQuestionLabel(ressource, debutAnneeGlissante) {
  const verbForms = {
    pensions_alimentaires_versees_individu: "versé",
    default: "reçu",
  }

  const verb = verbForms[ressource.id] || verbForms.default
  return `${[
    "Le montant",
    verb,
    "est-il le même <b>tous les mois</b> depuis",
    debutAnneeGlissante,
  ].join(" ")} ?`
}

function getLongLabel(individu, ressource) {
  const subject = IndividuMethods.label(individu)

  const auxForms = {
    demandeur: "avez",
    default: "a",
  }
  const aux = auxForms[individu._role] || auxForms.default

  const verbs = {
    pensions_alimentaires_versees_individu: "versés",
    default: "reçus",
  }
  const verb = verbs[ressource.id] || verbs.default

  return `${[subject, aux, verb, "en"].join(" ")} :`
}
</script>
