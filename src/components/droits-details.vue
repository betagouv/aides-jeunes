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
        v-if="showConditions(droit)"
        class="fr-highlight fr-ml-0 fr-py-2w fr-mb-2w"
      >
        <strong>Pour en bénéficier, vous devez également : </strong>
        <ul
          v-if="showVoluntaryConditions(droit)"
          class="fr-toggle__list fr-px-0"
        >
          <li
            v-for="(voluntary_condition, index) in droit.voluntary_conditions"
            :key="index"
          >
            <img alt="" src="@/assets/images/doigt.svg" class="fr-mr-1w" />
            <span v-html="voluntary_condition" />
            <span v-if="showVoluntaryOrganisationsLink(droit, index)">
              La liste des associations à proximité est disponible sur la
              plateforme
              <a :href="volontaryOrganisationsLink" target="_blank"
                >JeVeuxAider.gouv.fr</a
              >
            </span>
          </li>
        </ul>
        <ul v-if="showBaseConditions(droit)" class="fr-toggle__list fr-px-0">
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
      <div class="fr-print-hidden">
        <BenefitCta :benefit="droit" class="fr-mt-4w" />
        <div v-if="droit && showDetailsLieux" class="fr-print-hidden">
          <div class="fr-mt-4w">
            <DroitDetailsLieux :benefit="droit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue"
import BenefitCta from "./benefit-cta.vue"
import BenefitCtaLink from "./benefit-cta-link.vue"
import SituationMethods from "@lib/situation.js"
import DroitMixin from "@/mixins/droit-mixin.js"
import DroitHeader from "@/components/droit-header.vue"
import DroitDetailsLieux from "@/components/droits-details-lieux.vue"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.js"
import { EventAction } from "@lib/enums/event.js"
import { useVolontaryOrganisations } from "@/composables/use-voluntary-organisations.js"
import { StandardBenefit } from "@data/types/benefits.d.js"

export default {
  name: "DroitsDetails",
  components: {
    WarningMessage,
    DroitHeader,
    DroitDetailsLieux,
    BenefitCta,
    BenefitCtaLink,
  },
  mixins: [DroitMixin],
  props: {
    droit: {
      type: Object as PropType<StandardBenefit>,
      required: true,
    },
    droits: Array,
    ressourcesYearMinusTwoCaptured: Boolean,
  },
  setup() {
    return {
      store: useStore(),
      volontaryOrganisations: useVolontaryOrganisations(),
    }
  },
  data() {
    return {
      eventTypeMSA: EventAction.Msa,
      eventTypeLink: EventAction.Link,
    }
  },
  computed: {
    aCharge() {
      return SituationMethods.aCharge(this.store.situation)
    },
    showDetailsLieux() {
      return this.$route.name !== "aide"
    },
    volontaryOrganisationsLink() {
      return this.volontaryOrganisations.volontaryOrganisationsLink.value
    },
    showVoluntaryOrganisationsLink() {
      return (droit, index) =>
        this.volontaryOrganisationsLink &&
        index === droit.voluntary_conditions.length - 1
    },
    showConditions() {
      return (droit) =>
        droit.conditions?.length || droit.voluntary_conditions?.length
    },
    showBaseConditions() {
      return (droit) => droit.conditions?.length
    },
    showVoluntaryConditions() {
      return (droit) => droit.voluntary_conditions?.length
    },
  },
}
</script>
