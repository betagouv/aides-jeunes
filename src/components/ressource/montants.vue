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
          v-html="getQuestionLabel(type.meta, dates.twelveMonthsAgo.label)"
        />
      </YesNoQuestion>

      <div v-if="type.displayMonthly === true">
        <label :for="`${type.meta.id}_monthly`" class="fr-label">
          Indiquez le montant
          <b>net <span v-if="showSocialLabel">social </span>mensuel </b> :
        </label>
        <div class="fr-container fr-px-0">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
              <InputNumber
                :id="`${type.meta.id}_monthly`"
                :min="0"
                :value="type.amounts[dates.thisMonth.id]"
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
            précédentes peuvent être copiés en cliquant sur le bouton à droite
            du champ. Ils peuvent être modifiés ensuite.</span
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
              <div class="fr-col-12 fr-col-md-5">
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
                  @focus="() => onFocus(monthIndex)"
                />
              </div>
              <div
                v-if="showCopyButton(monthIndex)"
                class="fr-col-12 fr-col-md-6 fr-ml-md-3w fr-pt-1w fr-pt-md-0"
              >
                <button
                  type="button"
                  class="fr-btn--menu fr-btn"
                  @click.prevent="copyValueToFollowingMonths(index, monthIndex)"
                >
                  Copier sur les mois précédents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue"

import MonthLabel from "@/components/month-label.vue"
import YesNoQuestion from "@/components/yes-no-question.vue"
import IndividuMethods from "@lib/individu.js"
import InputNumber from "@/components/input-number.vue"
import { ResourceType } from "@lib/types/resources.d.js"
import { DatesRange } from "@lib/types/dates.d.js"

const focusedInputIndex = ref<number | null>(null)

const props = defineProps({
  type: { type: Object as PropType<ResourceType>, required: true },
  dates: { type: Object as PropType<DatesRange>, required: true },
  index: Number,
})

const emit = defineEmits(["update"])

const singleValue = computed({
  get: () => props.type.displayMonthly,
  set: (value) => emit("update", "displayMonthly", props.index, value),
})

const showSocialLabel = computed(
  () =>
    ![
      "gains_exceptionnels",
      "revenus_locatifs",
      "revenus_capital",
      "rpns_micro_entreprise_CA_bic_vente_imp",
      "rpns_micro_entreprise_CA_bic_service_imp",
      "rpns_micro_entreprise_CA_bnc_imp",
      "rpns_benefice_exploitant_agricole",
      "rpns_autres_revenus",
    ].includes(props.type.meta.id)
)

const onFocus = (monthIndex) => {
  focusedInputIndex.value = monthIndex
}

const copyValueToFollowingMonths = (index, monthIndex) => {
  emit("update", "monthUpdateFollowing", index, {
    monthIndex,
  })
}

const showCopyButton = (monthIndex) => {
  return (
    focusedInputIndex.value === monthIndex &&
    monthIndex < props.type.months.length - 1
  )
}

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
