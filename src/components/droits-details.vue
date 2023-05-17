<template>
  <div
    class="fr-tile fr-tile-horizontal fr-mb-2w"
    data-testid="droit-detail"
    itemscope
    itemtype="http://schema.org/GovernmentService"
  >
    <div class="fr-p-4w">
      <DroitHeader :droit="droit"></DroitHeader>
      <p class="fr-text--justify fr-mb-3w">
        <span itemprop="description" v-html="droit.description" />
        <span>&nbsp;</span>
        <BenefitCtaLink
          v-if="droit.link"
          :analytics-name="droit.id"
          :benefit="droit"
          :link="droit.link"
          itemprop="termsOfService"
          level="'inline'"
          :type="eventTypeLink"
        />
      </p>
      <div
        v-if="droit.conditions?.length"
        class="fr-highlight fr-ml-0 fr-py-2w fr-mb-2w"
      >
        <strong>Pour en bénéficier, vous devez également : </strong>
        <ul class="fr-toggle__list fr-px-0">
          <li v-for="(condition, index) in droit.conditions" :key="index">
            <img alt="" src="@/assets/images/doigt.svg" class="fr-mr-1w" />
            <span v-html="condition" />
          </li>
        </ul>
      </div>
      <WarningMessage
        v-if="
          droit.isBaseRessourcesYearMinusTwo &&
          !ressourcesYearMinusTwoCaptured &&
          !isString(droit.montant)
        "
        class="fr-print-hidden"
        data-testid="benefit-detail-warning"
      >
        Cette aide se base sur vos ressources de l'année
        {{ store.dates.fiscalYear.label }}
        <ul class="fr-btns-group fr-mt-2w">
          <li>
            <router-link
              v-if="!aCharge"
              class="fr-btn fr-btn--secondary"
              to="/simulation/ressources/fiscales"
              data-testid="benefit-ressources-link"
            >
              Déclarez vos ressources
              {{ store.dates.fiscalYear.label }}
            </router-link>
          </li>
        </ul>
      </WarningMessage>

      <WarningMessage
        v-if="
          droit.isBaseRessourcesPatrimoine &&
          !store.hasPatrimoine &&
          !isString(droit.montant)
        "
        class="fr-print-hidden"
      >
        <p>
          Cette aide se base sur votre patrimoine. Vous avez un patrimoine
          immobilier, d'épargne, des revenus fonciers et/ou du capital ? Vous
          devez renseigner des informations complémentaires.
        </p>
        <ul class="fr-btns-group fr-mt-2w">
          <li>
            <router-link
              id="patrimoine-link"
              class="fr-btn fr-btn--secondary"
              data-testid="patrimoine-link"
              to="/simulation/ressources/patrimoine"
            >
              Déclarez votre patrimoine
            </router-link>
          </li>
        </ul>
      </WarningMessage>
      <div v-if="abtestingValue === 'OldUI'" class="fr-print-hidden">
        <BenefitCta :benefit="droit" class="fr-mt-4w" />
        <a
          v-if="droit.msa"
          v-analytics="{
            name: droit.label,
            action: eventTypeMSA,
            category: 'General',
          }"
          class="aj-droit-pro-agricole"
          href="https://www.msa.fr/lfy/espace-prive"
          rel="noopener"
          target="_blank"
          title="Démarches pour les professions agricoles - Nouvelle fenêtre"
        >
          <img
            alt=""
            src="@/assets/images/doigt.svg"
            class="fr-mr-1w"
          />Démarches pour les professions agricoles
        </a>
      </div>
      <div v-else lass="fr-print-hidden">
        <BenefitCtaLight :benefit="droit" class="fr-mt-4w" />
        <div v-if="droit && showDetailsLieux" class="fr-print-hidden">
          <div class="fr-mt-4w">
            <hr class="fr-hr fr-py-2w" />
            <DroitDetailsLieux :benefit="droit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BenefitCtaLight from "./benefit-cta-light.vue"
import BenefitCta from "./benefit-cta.vue"
import BenefitCtaLink from "./benefit-cta-link.vue"
import Situation from "@/lib/situation.ts"
import DroitMixin from "@/mixins/droit-mixin.js"
import DroitHeader from "@/components/droit-header.vue"
import DroitDetailsLieux from "@/components/droits-details-lieux.vue"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.ts"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.ts"
import ABTestingService from "@/plugins/ab-testing-service.js"

export default {
  name: "DroitsDetails",
  components: {
    WarningMessage,
    DroitHeader,
    DroitDetailsLieux,
    BenefitCtaLight,
    BenefitCta,
    BenefitCtaLink,
  },
  mixins: [DroitMixin],
  props: {
    droit: Object,
    droits: Array,
    ressourcesYearMinusTwoCaptured: Boolean,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      eventTypeMSA: BehaviourEventTypes.msa,
      eventTypeLink: BehaviourEventTypes.link,
    }
  },
  computed: {
    aCharge() {
      return Situation.aCharge(this.store.situation)
    },
    showDetailsLieux() {
      return this.$route.name !== "aide"
    },
    abtestingValue() {
      return ABTestingService.getValues().benefit_result_page
    },
  },
}
</script>
