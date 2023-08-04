<template>
  <form>
    <fieldset
      v-for="individu in individus"
      :key="individu.id"
      class="fr-fieldset"
    >
      <legend class="fr-fieldset__legend fr-px-0">
        <h2 class="fr-text--lead">
          Indiquez toutes les ressources <strong>nettes versées</strong> perçues
          <span v-if="individu._role !== 'demandeur'"
            ><strong>par {{ individu.label }}</strong></span
          >
          en France comme à l'étranger.
        </h2>
      </legend>
      <div class="fr-fieldset__content">
        <div v-if="individu.display">
          <p>
            Ces informations se trouvent sur votre avis d'imposition
            {{ store.dates.lastYear.label }} sur les revenus
            {{ store.dates.fiscalYear.label }}. <br />Vous pouvez le retrouver
            en ligne sur
            <a
              href="http://www.impots.gouv.fr/"
              rel="noopener"
              target="_blank"
              title="impots.gouv.fr - Nouvelle fenêtre"
              >impots.gouv.fr</a
            >.
          </p>
          <div
            v-for="ressource in categoriesRnc"
            :key="ressource.id"
            class="fr-mb-2w"
          >
            <label :for="ressource.id" class="fr-label">
              {{ ressource.label }}
              <input
                :id="ressource.id"
                v-model="
                  individu.values[ressource.id][store.dates.fiscalYear.id]
                "
                v-select-on-click
                class="fr-input fr-col-6 fr-col-xs-5 fr-col-lg-5"
                type="number"
              />
              <span v-if="individu.default[ressource.id]" class="fr-hint-text">
                Ce montant vaut {{ individu.default[ressource.id] }} pour les 12
                derniers mois.</span
              >
            </label>
          </div>
        </div>
      </div>
      <ul
        v-if="!individu.display"
        class="fr-btns-group fr-btns-group--inline fr-text--center"
      >
        <li
          ><button
            class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-circle-line"
            @click="individu.display = !individu.display"
          >
            Déclarer des ressources pour {{ individu.label }}
          </button></li
        >
      </ul>
    </fieldset>

    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script lang="ts">
import Individu from "@lib/individu.js"
import { categoriesRnc } from "@lib/resources.js"
import ActionButtons from "@/components/action-buttons.vue"
import { useStore } from "@/stores/index.js"

export default {
  name: "RessourcesFiscales",
  components: {
    ActionButtons,
  },
  setup() {
    return { store: useStore() }
  },
  data() {
    const fiscalYear = this.store.dates.fiscalYear.id
    let individus = this.store.peopleParentsFirst.map((source) => {
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
          source[categorieRnc.id]?.[fiscalYear]
        individu.default[categorieRnc.id] = this.getDefaultValue(
          this.store.dates.last12Months,
          source,
          categorieRnc
        )
      })

      individu.display =
        Individu.isParent(source) ||
        categoriesRnc.some(
          (ressource) =>
            source[ressource.id] &&
            source[ressource.id][fiscalYear] !== undefined
        )
      return individu
    })

    return {
      categoriesRnc,
      individus,
    }
  },
  methods: {
    onSubmit() {
      const fiscalYear = this.store.dates.fiscalYear.id
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

      this.store.ressourcesFiscales(values)
      this.$router.push("/simulation/resultats")
    },
    getDefaultValue(months, individu, rnc) {
      return (rnc.sources || []).reduce((total, sourceName) => {
        if (!individu[sourceName]) {
          return total
        }
        let ressource = individu[sourceName]
        return (
          total +
          months.reduce((acc, month) => acc + (ressource[month.id] || 0), 0)
        )
      }, 0)
    },
  },
}
</script>
