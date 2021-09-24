<template>
  <form>
    <YesNoQuestion class="form__group" v-model="parentsPayPensionsAlimentaires">
      {{ subject }} <strong>versé</strong> des pensions alimentaires
      <b> depuis {{ $store.state.dates.twelveMonthsAgo.label }}</b
      > ?
    </YesNoQuestion>

    <div class="form__group" v-if="parentsPayPensionsAlimentaires">
      <div
        class="form__group"
        v-for="(item, index) in types"
        v-bind:key="item.individu.id"
      >
        <h2>{{ $filters.capitalize(individuLabel(item.individu)) }}</h2>
        <RessourceMontants
          without-header
          v-bind:individu="item.individu"
          v-bind:index="index"
          v-bind:type="item"
          v-on:update="process"
        />
      </div>
    </div>

    <div class="text-right">
      <button type="submit" class="button large" v-on:click.prevent="next"
        >Valider</button
      >
    </div>

    <router-link to="extra-pole-emploi">Expérimentation ESTIME</router-link>
  </form>
</template>

<script>
import { ressourceTypes } from "@/constants/resources"
import Individu from "@/lib/Individu"
import Ressource from "@/lib/Ressource"
import RessourceMontants from "@/components/Ressource/Montants"
import YesNoQuestion from "@/components/YesNoQuestion"
import RessourceProcessor from "@/mixins/RessourceProcessor"

export default {
  name: "pensions-alimentaires",
  mixins: [RessourceProcessor],
  components: {
    RessourceMontants,
    YesNoQuestion,
  },
  data() {
    let situation = this.$store.state.situation
    let pensionsVersees = ressourceTypes.find(
      (ressourceType) =>
        ressourceType.id === "pensions_alimentaires_versees_individu"
    )

    let demandeur = Object.assign({}, situation.demandeur)
    let conjoint = situation.conjoint
    let individus = [demandeur]
    if (conjoint) {
      individus.push(Object.assign({}, conjoint))
    }

    let types = individus.map((individu) => {
      Ressource.setDefaultValueForCurrentYear(
        this.$store.state.dates,
        individu,
        pensionsVersees
      )
      let amounts = Object.assign({}, individu[pensionsVersees.id])
      let months = Ressource.getPeriodsForCurrentYear(
        this.$store.state.dates,
        pensionsVersees
      )

      return {
        individu,
        amounts,
        months,
        displayMonthly: this.getDisplayMonthly(months, amounts),
        meta: pensionsVersees,
      }
    })

    return {
      types,
      pensionsVersees,
      parentsPayPensionsAlimentaires: types.reduce(function (accum, item) {
        return accum || item.some((item) => item.amounts)
      }, false),
    }
  },
  computed: {
    subject: function () {
      return this.types.length === 1
        ? "Avez-vous"
        : "Vous ou votre conjoint·e actuel·le avez-vous"
    },
  },
  methods: {
    individuLabel: Individu.label,
    next: function () {
      if (this.parentsPayPensionsAlimentaires) {
        this.save(this.types)
      } else {
        this.types.forEach((item) => {
          Ressource.unsetForCurrentYear(
            this.$store.state.dates,
            item.individu,
            item.meta
          )
          this.$store.dispatch("updateIndividu", item.individu)
        })
      }
      this.$push()
    },
  },
}
</script>

<style scoped lang="css"></style>
