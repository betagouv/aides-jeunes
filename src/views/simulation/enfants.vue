<template>
  <form @submit.prevent="next">
    <fieldset class="fr-fieldset">
      <legend class="fr-fieldset__legend fr-px-0">
        <span class="fr-text--lead">Mes enfants à charge</span>
        <EnSavoirPlus />
        <span class="fr-hint-text"
          >Si vous n'avez pas d'enfant à charge, cliquez sur le bouton
          "Suivant".</span
        >
      </legend>
      <div class="fr-fieldset__content">
        <div v-for="enfant in enfants" :key="enfant.id" class="fr-mb-4w">
          <div v-if="enfant.date_naissance">
            <div class="fr-container fr-px-0">
              <div class="fr-grid-row fr-grid-row--middle">
                <div class="fr-col fr-text--bold">{{ enfant._firstName }}</div>
                <div class="fr-col">
                  <ul
                    class="fr-btns-group fr-btns-group--inline fr-grid-row--right"
                  >
                    <li
                      ><button
                        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-mb-0"
                        @click="editPAC(enfant.id)"
                        >éditer</button
                      ></li
                    >
                    <li
                      ><button
                        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-mb-0"
                        @click="removePAC(enfant.id)"
                        >supprimer</button
                      ></li
                    >
                  </ul>
                </div>
              </div>
            </div>
            <hr class="fr-hr fr-pb-1w" />
            <div class="fr-container fr-px-0">
              <div class="fr-grid-row fr-grid-row--middle">
                <p class="fr-col-4 fr-m-0">
                  <span class="fr-text--sm">Sa date de naissance</span><br />
                  <span>{{ birthDate(enfant.date_naissance) }}</span>
                </p>
                <p class="fr-col-4 fr-m-0">
                  <span class="fr-text--sm">Sa nationalité</span><br />
                  <span>{{ nationality(enfant.nationalite) }}</span>
                </p>
                <p class="fr-col-4 fr-m-0">
                  <span class="fr-text--sm">Sa situation</span><br />
                  <span>{{ scolarite(enfant.scolarite) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          data-testid="add-pac"
          class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-add-circle-line"
          @click="addPAC()"
        >
          Ajouter un enfant à charge
        </button>
      </div>
    </fieldset>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script lang="ts">
import ActionButtons from "@/components/action-buttons.vue"
import { childStepsComplete, getIncompleteChildId } from "@lib/enfants.js"
import Nationality from "@/lib/nationality.js"
import EnSavoirPlus from "@/components/en-savoir-plus.vue"
import ScolariteCategories from "@lib/scolarite"
import { useStore } from "@/stores/index.js"

export default {
  name: "SimulationEnfants",
  components: {
    EnSavoirPlus,
    ActionButtons,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    enfants() {
      return this.store.situation.enfants || []
    },
  },

  methods: {
    addPAC() {
      if (!this.enfants.length || childStepsComplete(this.store.situation)) {
        const enfantId = this.store.addEnfant()
        this.$router.push(`/simulation/individu/enfant_${enfantId}/_firstName`)
      } else {
        const incompleteChildId = getIncompleteChildId(this.store.situation)
        this.editPAC(incompleteChildId)
      }
    },
    removePAC(id) {
      this.store.removeEnfant(id)
    },
    editPAC(id) {
      this.store.editEnfant()
      this.$router.push(`/simulation/individu/${id}/_firstName`)
    },
    onSubmit() {
      const enfants = this.enfants.filter((enfant) => {
        if (!enfant.date_naissance) {
          this.store.removeEnfant(enfant.id)
          return false
        }
        return true
      })
      this.store.answer({
        entityName: "enfants",
        path: this.$route.path,
        value: enfants.length,
      })
      this.$push()
    },
    birthDate(date?: Date | string) {
      if (date) {
        return new Date(date).toLocaleDateString("FR-fr")
      } else {
        return "Non renseigné"
      }
    },
    nationality: Nationality.getNationalityFromCountryCode,
    scolarite(value) {
      const scolariteType = ScolariteCategories.scolariteTypes.find(
        (s) => s.value === value
      )
      const scolariteEnfantType = ScolariteCategories.scolariteEnfantTypes.find(
        (s) => s.value === value
      )
      return scolariteType?.label || scolariteEnfantType?.label || "-"
    },
  },
}
</script>
