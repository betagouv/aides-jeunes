<template>
  <form class="fr-form-group">
    <p>
      Indiquez toutes les ressources <strong>nettes</strong> perçues
      <span v-if="individu._role !== 'demandeur'"
        ><strong>par {{ getIndividuNom() }}</strong></span
      >
      en France comme à l'étranger.
    </p>
    <div v-for="(type, index) in types" :key="type.meta.id">
      <RessourceMontants
        v-if="isSimple(type.meta.id)"
        :index="index"
        :type="type"
        :dates="store.dates"
        @update="process"
      />
      <RessourceMicroEntreprise
        v-if="type.meta.id.startsWith('rpns_micro_entreprise_CA')"
        :individu="type.individu"
        :ressource="type"
        @update="updateTNSAmount"
      />
      <RessourceProfessionLiberale
        v-if="type.meta.id === 'rpns_autres_revenus'"
        :individu="type.individu"
        :ressource="type"
        @update="updateTNSAmount"
        @update-extra="updateTNSExtra"
      />
      <RessourceExploitantAgricole
        v-if="type.meta.id === 'rpns_benefice_exploitant_agricole'"
        :individu="type.individu"
        :ressource="type"
        @update="updateTNSAmount"
      />
    </div>

    <ActionButtons :on-submit="onSubmit" :disable-submit="!canSubmit" />
  </form>
</template>

<script lang="ts">
import ActionButtons from "@/components/action-buttons.vue"
import RessourceExploitantAgricole from "@/components/ressource/exploitant-agricole.vue"
import RessourceMicroEntreprise from "@/components/ressource/micro-entreprise.vue"
import RessourceProfessionLiberale from "@/components/ressource/profession-liberale.vue"
import RessourceMontants from "@/components/ressource/montants.vue"

import RessourceProcessor from "@/mixins/ressource-processor.js"
import { ressourceTypes } from "@lib/resources.js"
import Ressource from "@lib/ressource.js"
import IndividuMethods from "@lib/individu.js"
import { getAnswer } from "@lib/answers.js"
import { useStore } from "@/stores/index.js"
import { Individu } from "@lib/types/individu.d.js"
import { ResourceType } from "@lib/types/resources.d.js"

export default {
  name: "RessourcesMontants",
  components: {
    RessourceExploitantAgricole,
    RessourceMicroEntreprise,
    RessourceProfessionLiberale,
    RessourceMontants,
    ActionButtons,
  },
  mixins: [RessourceProcessor],
  setup() {
    return { store: useStore() }
  },
  data() {
    const individu = this.getIndividu()
    return {
      individu,
      types: this.getTypes(individu),
    }
  },
  computed: {
    canSubmit() {
      return this.types.every((type) => {
        return Object.keys(type.amounts).every((period) => {
          return (
            type.amounts[period] !== undefined &&
            type.amounts[period] >= 0 &&
            !isNaN(type.amounts[period])
          )
        })
      })
    },
  },
  watch: {
    $route(toRoute, fromRoute) {
      if (toRoute.name !== "ressources/montants") {
        return
      } else if (
        toRoute.params.id != fromRoute.params.id ||
        toRoute.params.category != fromRoute.params.category
      ) {
        this.individu = this.getIndividu()
        this.types = this.getTypes(this.individu)
      }
    },
  },
  created() {
    // initialise this.tpye.amounts to 0 if not defined or empty char
    this.types.forEach((type) => {
      Object.keys(type.amounts).forEach((period) => {
        if (type.amounts[period] === null || type.amounts[period] === "") {
          type.amounts[period] = ""
        }
      })
    })
  },
  methods: {
    getIndividuNom() {
      return IndividuMethods.label(this.individu, "nom")
    },
    getIndividu(): Individu {
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const { individu } = IndividuMethods.get(
        this.store.peopleParentsFirst,
        role,
        this.$route.params.id
      )
      return individu
    },
    getTypes(individu: Individu): ResourceType[] {
      const selectedTypes = Ressource.getIndividuRessourceTypesByCategory(
        individu,
        this.$route.params.category,
        this.store.situation
      )

      const answers = getAnswer(
        this.store.simulation.answers.all,
        "individu",
        this.$route.params.category,
        this.$route.params.id
      )

      return ressourceTypes.reduce((resourceTypes, type) => {
        if (selectedTypes[type.id]) {
          let amounts = Object.assign({}, individu[type.id])
          if (answers) {
            const answer = answers.find((value) => value.id === type.id)
            if (answer) {
              Object.keys(amounts).forEach((amount) => {
                if (amounts[amount] === null) {
                  amounts[amount] = answer.amounts[amount]
                }
              })
            }
          }

          const months = Ressource.getPeriodsForCurrentYear(
            this.store.dates,
            type
          )

          resourceTypes.push({
            amounts,
            individu,
            months,
            displayMonthly: this.getDisplayMonthly(months, amounts),
            meta: type,
            extra: (type.extra || []).reduce((a, e) => {
              a[e.id] = individu[e.id]
              return a
            }, {}),
          })
        }
        return resourceTypes
      }, [] as ResourceType[])
    },
    isSimple(type) {
      const complex = [
        "rpns_benefice_exploitant_agricole",
        "rpns_micro_entreprise_CA_bic_vente_imp",
        "rpns_micro_entreprise_CA_bic_service_imp",
        "rpns_micro_entreprise_CA_bnc_imp",
        "rpns_autres_revenus",
      ]
      return complex.indexOf(type) === -1
    },
    onSubmit() {
      if (!this.canSubmit) return
      this.store.answer({
        id: this.$route.params.id,
        entityName: "individu",
        fieldName: this.$route.params.category,
        path: this.$route.path,
        value: this.types.map((type) => {
          Object.keys(type.amounts).forEach(function (period) {
            if (
              type.amounts[period] === null ||
              isNaN(type.amounts[period]) ||
              type.amounts[period] === ""
            ) {
              type.amounts[period] = 0
            }
          })
          return {
            id: type.meta.id,
            amounts: type.amounts,
          }
        }),
      })

      this.types.forEach((type) => {
        if (type.extra) {
          Object.keys(type.extra).forEach((extraId) => {
            this.store.answer({
              id: this.$route.params.id,
              entityName: "individu",
              fieldName: extraId,
              path: this.$route.path,
              value: type.extra[extraId],
            })
          })
        }
      })

      this.$push()
    },
    updateTNSAmount(type, period, value) {
      type.amounts[period] = value
    },
    updateTNSExtra(type, item, value) {
      type.extra[item] = value
    },
  },
}
</script>
