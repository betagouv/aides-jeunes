<template>
  <form>
    <div v-for="individu in individus" :key="individu.id" class="form__group">
      <button
        v-if="!individu.display"
        class="button outline with-icon m-auto"
        @click="individu.display = !individu.display"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 4.25C7.5875 4.25 7.25 4.5875 7.25 5V7.25H5C4.5875 7.25 4.25 7.5875 4.25 8C4.25 8.4125 4.5875 8.75 5 8.75H7.25V11C7.25 11.4125 7.5875 11.75 8 11.75C8.4125 11.75 8.75 11.4125 8.75 11V8.75H11C11.4125 8.75 11.75 8.4125 11.75 8C11.75 7.5875 11.4125 7.25 11 7.25H8.75V5C8.75 4.5875 8.4125 4.25 8 4.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
            fill="#6575EA"
          />
        </svg>
        Déclarer des ressources pour {{ individu.label }}
      </button>
      <div v-if="individu.display">
        <h2>
          Indiquez toutes les ressources <strong>nettes versées</strong> perçues
          <span v-if="individu._role !== 'demandeur'"
            ><strong>par {{ individu.label }}</strong></span
          >
          en France comme à l'étranger.
        </h2>
        <p>
          Ces informations se trouvent sur votre avis d'imposition
          {{ $store.state.dates.lastYear.label }} sur les revenus
          {{ $store.state.dates.fiscalYear.label }}. <br />Vous pouvez le
          retrouver en ligne sur
          <a target="_blank" rel="noopener" href="http://www.impots.gouv.fr/"
            >impots.gouv.fr</a
          >.
        </p>
        <label
          v-for="ressource in categoriesRnc"
          :key="ressource.id"
          class="form__group"
        >
          {{ ressource.label }}
          <input
            v-model="
              individu.values[ressource.id][$store.state.dates.fiscalYear.id]
            "
            v-select-on-click
            type="number"
          />
          <span v-if="individu.default[ressource.id]">
            Ce montant vaut {{ individu.default[ressource.id] }} pour les 12
            derniers mois.</span
          >
        </label>
      </div>
    </div>

    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import sum from "lodash/sum"
import some from "lodash/some"
import isNaN from "lodash/isNaN"
import Individu from "../../../../lib/individu"
import { categoriesRnc } from "../../../../lib/resources"
import ActionButtons from "@/components/action-buttons"

function getDefaultValue(months, individu, rnc) {
  return sum(
    (rnc.sources || []).map(function (sourceName) {
      if (!individu[sourceName]) {
        return 0
      }

      let ressource = individu[sourceName]
      return sum(months.map((month) => ressource[month.id] || 0))
    })
  )
}

export default {
  name: "RessourcesFiscales",
  components: {
    ActionButtons,
  },
  data: function () {
    const fiscalYear = this.$store.state.dates.fiscalYear.id
    let individus = this.$store.getters.peopleParentsFirst.map((source) => {
      let individu = {
        label: Individu.label(source),
        default: {},
        values: {},
        id: source.id,
      }

      categoriesRnc.forEach((categorieRnc) => {
        individu.values[categorieRnc.id] = Object.assign(
          {},
          source[categorieRnc.id] || {}
        )
        individu.values[categorieRnc.id][fiscalYear] =
          source[categorieRnc.id] && source[categorieRnc.id][fiscalYear]
        individu.default[categorieRnc.id] = getDefaultValue(
          this.$store.state.dates.last12Months,
          source,
          categorieRnc
        )
      })

      individu.display =
        Individu.isParent(source) ||
        some(
          categoriesRnc.map(
            (ressource) =>
              source[ressource.id] &&
              source[ressource.id][fiscalYear] !== undefined
          )
        )
      return individu
    })

    return {
      categoriesRnc,
      individus,
    }
  },
  methods: {
    onSubmit: function () {
      const fiscalYear = this.$store.state.dates.fiscalYear.id
      const values = {}
      this.individus.forEach((individu) => {
        const individuValues = {}
        this.categoriesRnc.forEach((categorieRnc) => {
          const raw = individu.values[categorieRnc.id][fiscalYear]
          const value = parseFloat(raw)
          individuValues[categorieRnc.id] =
            raw === undefined ? raw : isNaN(value) ? 0 : value
        })
        values[individu.id] = individuValues
      })

      this.$store.dispatch("ressourcesFiscales", values)
      this.$router.push("/simulation/resultats")
    },
  },
}
</script>
