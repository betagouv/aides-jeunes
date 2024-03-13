<template>
  <ErrorsEmailAndSmsModal />

  <WarningMessage v-if="hasWarning">
    <div>
      <h2 class="fr-text--lead"> Aucun résultat disponible </h2>
      <h3 class="fr-text--lg">
        La simulation à laquelle vous souhaitez accéder n‘est pas accessible.
      </h3>
      <p class="fr-text--lg">
        Pour commencer votre simulation, rendez-vous sur la
        <router-link to="home"> page d'accueil</router-link>
        .
      </p>
    </div>
  </WarningMessage>

  <div v-if="isSimulationUnavailable" class="fr-alert fr-alert--info fr-my-1w">
    <div>
      <h2 class="fr-text--lead">
        Vos résultats de simulation ne sont plus disponibles
      </h2>
      <h3 class="fr-text--lg">
        La simulation à laquelle vous souhaitez accéder n‘est plus accessible.
      </h3>
      <p class="fr-text--lg">
        Pour commencer une nouvelle simulation, rendez-vous sur la
        <router-link to="home"> page d'accueil</router-link>
        .
      </p>
    </div>
  </div>

  <ErrorBlock v-if="error" />
  <ErrorSaveBlock v-if="hasErrorSave" />
  <div v-show="shouldDisplayResults">
    <div v-if="!isEmpty(benefits)">
      <p class="fr-text--lg">
        D'après la situation que vous avez décrite, vous êtes a priori éligible
        à ces aides.
        <span id="print-disclaimer"
          >Ces résultats sont fondés sur les seules informations que vous avez
          indiquées et ne constituent en aucune façon un engagement de la part
          des organismes cités.</span
        >
        Les montants avancés sont arrondis à une dizaine d'euros près :
      </p>
      <BenefitsList :benefits-and-benefit-groups="benefitTree" />
    </div>

    <div v-show="isEmpty(benefits)" class="fr-py-5w">
      <h2 class="fr-text--lead">
        Votre simulation n'a pas permis de découvrir de nouveaux droits.
      </h2>
      <p class="fr-text--lg">
        Nous mettons à jour régulièrement le simulateur en ajoutant de nouvelles
        aides. N'hésitez pas à faire une simulation dans les prochains mois.
      </p>
    </div>

    <div class="fr-print-only">
      <Recapitulatif />
    </div>

    <div class="fr-print-hidden">
      <TrouverInterlocuteur />

      <div class="fr-container fr-px-0 fr-mb-0 fr-py-2w">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-5">
            <OfflineResults v-if="!updating && !isEmpty(benefits)" />
          </div>
          <div class="fr-col-12 fr-col-md-7">
            <Feedback />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import ErrorBlock from "@/components/error-block.vue"
import ErrorSaveBlock from "@/components/error-save-block.vue"
import Feedback from "@/components/feedback.vue"
import OfflineResults from "@/components/offline-results.vue"
import TrouverInterlocuteur from "@/components/trouver-interlocuteur.vue"
import WarningMessage from "@/components/warning-message.vue"
import Recapitulatif from "@/views/simulation/recapitulatif.vue"
import { useResultsStore } from "@/stores/results.js"
import ErrorsEmailAndSmsModal from "@/components/modals/errors-email-and-sms-modal.vue"
import { computed } from "vue"

const resultsStore = useResultsStore()
const benefits = computed(() => resultsStore.benefits)
const benefitTree = computed(() => resultsStore.benefitTree)
const hasWarning = computed(() => resultsStore.hasWarning)
const updating = computed(() => resultsStore.updating)
const error = computed(() => resultsStore.error)
const hasErrorSave = computed(() => resultsStore.hasErrorSave)
const isSimulationUnavailable = computed(
  () => resultsStore.isSimulationUnavailable
)
const shouldDisplayResults = computed(() => resultsStore.shouldDisplayResults)

const isEmpty = (array) => {
  return !array || array.length === 0
}
</script>
