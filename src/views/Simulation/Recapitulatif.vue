<template>
  <form @submit.prevent="onSubmit" class="recapitulatif-form">
    <h2>Récapitulatif</h2>
    <div>
      <template v-for="(chapter, chapterIndex) in chapters">
        <div
          class="chapter-block"
          :key="chapter.name"
          v-if="chapter.questions.length"
        >
          <h3 class="aj-question">{{ chapter.label }}</h3>
          <template v-for="(question, questionIndex) in chapter.questions">
            <template v-if="question.isChapterSubtitle">
              <div
                :key="`chapter_${chapterIndex}_question_${questionIndex}`"
                class="recapitulatif-row"
              >
                <div v-html="question.label" class="subtitle"></div>
              </div>
            </template>
            <template v-else>
              <div
                :key="`chapter_${chapterIndex}_question_${questionIndex}`"
                class="recapitulatif-row"
              >
                <div class="question-col" v-html="question.label"></div>

                <div
                  class="value-col"
                  v-if="typeof question.value !== 'object'"
                  >{{ question.value }}</div
                >
                <div class="edit-col"
                  ><router-link :to="question.path">Modifier</router-link></div
                >
              </div>
              <template v-if="typeof question.value === 'object'">
                <div
                  :key="`chapter_${chapterIndex}_question_${questionIndex}_obj`"
                  class="recapitulatif-row recapitulatif-row-wrap"
                >
                  <div
                    class="value-cell"
                    v-for="(value, name) in question.value"
                    :key="name"
                  >
                    <div style="font-style: italic">{{ name }} :</div>
                    <div>{{ value }}</div>
                  </div>
                </div>
              </template>
            </template>
          </template>
        </div>
      </template>
    </div>

    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import IndividuQuestions from "@/lib/IndividuQuestions"
import {
  capitalize,
  displayEnumValue,
  displayValue,
  displayYesNoValue,
  executeFunctionOrReturnValue,
  displayCurrencyValue,
  displayDepcomValue,
} from "@/lib/Utils"
import Individu from "@/lib/Individu"
import FamilleQuestions from "@/lib/FamilleQuestions"
import ParentQuestions from "@/lib/ParentQuestions"
import Ressource from "@/lib/Ressource"
import { ressourceCategories, ressourceTypes } from "@/constants/resources"
import Logement from "@/lib/Logement"

function getIndividuByStep(step, component) {
  const role = step.id.split("_")[0]
  return Individu.get(
    component.$store.getters.peopleParentsFirst,
    role,
    step.id,
    component.$store.state.dates
  ).individu
}

const SIMPLE_STEPS = {
  enfant_a_charge(step) {
    const individu = getIndividuByStep(step, this)
    return [
      {
        label: capitalize(
          individu._role === "demandeur"
            ? `Figurez-vous sur la dernière déclaration d'impôts de vos parents ?`
            : `${Individu.label(
                individu,
                "nom"
              )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu ?`
        ),
        value: displayYesNoValue(
          individu["enfant_a_charge"][this.$store.state.dates.thisYear.id]
        ),
      },
    ]
  },
  statut_marital(step) {
    const individu = getIndividuByStep(step, this)
    return [
      {
        label: "Quelle est votre relation avec votre conjoint ?",
        value: displayEnumValue(
          individu[step.variable],
          Individu.situationsFamiliales
        ),
      },
    ]
  },
  _firstName(step) {
    return [
      {
        label: "Quel est le prénom de votre enfant ?",
        value: getIndividuByStep(step, this)[step.variable],
      },
    ]
  },
  _bourseCriteresSociauxCommuneDomicileFamilial() {
    return [
      {
        label: "Quel est le code postal de la commune de vos parents ?",
        value: displayDepcomValue(
          this.individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal,
          this.individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune
        ),
      },
    ]
  },
  depcom() {
    const menage = this.$store.getters.getMenage
    return [
      {
        label: "Quel est votre code postal ?",
        value: displayDepcomValue(menage._codePostal, menage._nomCommune),
      },
    ]
  },
  coloc() {
    return [
      {
        label: "Est-ce une colocation ?",
        value: displayYesNoValue(this.$store.getters.getMenage.coloc),
      },
    ]
  },
  logement_chambre() {
    return [
      {
        label: `Est-ce une chambre ? <span class="help">Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.</span>`,
        value: displayYesNoValue(
          this.$store.getters.getMenage.logement_chambre
        ),
      },
    ]
  },
  participation_frais() {
    return [
      {
        label: `Participez-vous aux frais du logement ?<span class="help">Par exemple aux dépenses d'électricité, de téléphone, etc.</span>`,
        value: displayYesNoValue(
          this.$store.getters.getMenage.participation_frais
        ),
      },
    ]
  },
}

const COMPLEXE_STEPS = {
  "ressources/montants": {
    matcher(step) {
      return step.key.match(/ressources\/montants\/(\w)*/)
    },
    fn(step) {
      const key_split = step.key.split("/")
      const id = key_split[1]
      const individu = getIndividuByStep({ id, role: id.split("_")[0] }, this)

      const categoryId = key_split[key_split.length - 1]
      const ressources = Ressource.getIndividuRessourceTypes(
        individu,
        this.$store.state.situation
      )
      const category = ressourceCategories.find(
        (category) => category.id === categoryId
      )
      const result = [
        {
          isChapterSubtitle: true,
          label: category && capitalize(category.label(individu)),
          value: "",
        },
        ...ressourceTypes
          .filter((type) => type.category === categoryId && ressources[type.id])
          .map((type) => {
            return {
              label: capitalize(type.label),
              value: Object.entries(individu[type.id]).reduce(
                (accum, [key, value]) => {
                  accum[key] = displayCurrencyValue(value)
                  return accum
                },
                {}
              ),
            }
          }),
      ]
      return result
    },
  },
  logement: {
    matcher(step) {
      return step.key.match(/\/logement$/)
    },
    fn() {
      const menage = this.$store.state.situation.menage
      return [
        {
          label: "Êtes-vous ?",
          value: Logement.getStatutOccupationLabel(
            menage.statut_occupation_logement
          ),
        },
      ]
    },
  },
  loyer: {
    matcher(step) {
      return step.key.match(/\/loyer$/)
    },
    fn() {
      const loyerData = Logement.getLoyerData(
        this.$store.getters.getMenage,
        this.$store.getters.getLogementStatut || ""
      )
      return [
        {
          label: loyerData.loyerQuestion.label,
          value: displayCurrencyValue(loyerData.loyerQuestion.selectedValue),
        },
        loyerData.chargesQuestion && {
          label: loyerData.chargesQuestion.label,
          value: displayCurrencyValue(loyerData.chargesQuestion.selectedValue),
        },
      ].filter((item) => item)
    },
  },
}
export default {
  name: "Recapitulatif",
  components: {
    Actions,
  },
  computed: {
    activeJourney() {
      return this.$store.getters.getAllSteps.filter((s) => s.isActive)
    },
    chapters() {
      return this.$state
        .chapters(this.$route.path, this.$store.getters.getAllSteps)
        .map((chapter) => {
          return {
            label: chapter.label,
            questions: this.stepPerChapter(chapter.name).reduce(
              (accum, step) => {
                accum.push(
                  ...this.questionsPerStep(step).map((question) => {
                    question.path = step.path
                    return question
                  })
                )
                return accum
              },
              []
            ),
          }
        })
    },
  },
  methods: {
    stepPerChapter(chapterName) {
      return this.activeJourney.filter((step) => step.chapter === chapterName)
    },

    onSubmit() {
      this.$push()
    },

    buildMutualizedQuestion(data) {
      return data.question
        ? [
            {
              label: capitalize(
                executeFunctionOrReturnValue(
                  data.question,
                  "question",
                  data.component
                )
              ),
              value: displayValue(
                data.individu[data.variable],
                data.question,
                data.component
              ),
            },
          ]
        : []
    },

    questionsPerStep(step) {
      if (!step.entity || !step.variable) console.log(step)
      let data = {
        variable: step.variable,
      }
      if (SIMPLE_STEPS[step.variable]) {
        return SIMPLE_STEPS[step.variable].bind(this)(step)
      }
      if (step.variable === undefined) {
        const match = Object.keys(COMPLEXE_STEPS).find((key) =>
          COMPLEXE_STEPS[key].matcher(step)
        )
        if (match) {
          return COMPLEXE_STEPS[match].fn.bind(this)(step)
        }
      }

      switch (step.entity) {
        case "individu":
          data.individu = getIndividuByStep(step, this)

          data.component = { ...this, individu: data.individu }
          data.question = IndividuQuestions[step.variable]
          return this.buildMutualizedQuestion(data)
        case "famille":
          data.question = FamilleQuestions[step.variable]
          data.component = this
          return this.buildMutualizedQuestion(data)

        case "parents":
          data.question = ParentQuestions[step.variable]
          data.component = this

          return this.buildMutualizedQuestion(data)
        default:
          console.log("### This step is not displayed:", step)
          break
      }
      return []
    },
  },
}
</script>

<style scoped lang="scss"></style>
