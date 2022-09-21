<template>
  <div
    class="aj-droit-detail normal-padding-bottom"
    itemscope
    itemtype="http://schema.org/GovernmentService"
    data-testid="droit-detail"
  >
    <DroitHeader :droit="droit"></DroitHeader>

    <div class="aj-droit-content">
      <div class="aj-droit-content-heading">
        <div class="aj-droit-content-description">
          <p>
            <span itemprop="description" v-html="droit.description" />
            <span>&nbsp;</span>
            <BenefitCtaLink
              v-if="droit.link"
              :analytics-name="droit.label"
              :link="droit.link"
              :benefit="droit"
              type="link"
              level="'inline'"
              itemprop="termsOfService"
            />
          </p>
          <div v-if="droit.conditions?.length" class="aj-droit-conditions">
            <p class="aj-droit-conditions-title"
              >Pour en bénéficier, vous devez également :</p
            >
            <ul class="list-unstyled">
              <li v-for="(condition, index) in droit.conditions" :key="index">
                <img src="@/assets/images/doigt.svg" alt="" />
                <span v-html="condition" />
              </li>
            </ul>
          </div>
        </div>
        <div class="aj-droit-notifications">
          <WarningMessage
            v-if="
              droit.isBaseRessourcesYearMinusTwo &&
              !ressourcesYearMinusTwoCaptured &&
              !isString(droit.montant)
            "
            class="print-hidden"
          >
            <span>
              <i class="fa fa-warning" aria-hidden="true" />  Cette aide se base
              sur vos ressources de l'année
              {{ store.dates.fiscalYear.label }}
            </span>
            <router-link
              v-if="!aCharge"
              class="button outline red no-shadow text-center"
              to="/simulation/ressources/fiscales"
            >
              Déclarez vos ressources
              {{ store.dates.fiscalYear.label }}
            </router-link>
          </WarningMessage>

          <WarningMessage
            v-if="
              droit.isBaseRessourcesPatrimoine &&
              !patrimoineCaptured &&
              !isString(droit.montant)
            "
            class="print-hidden"
          >
            <span>
              <i class="fa fa-warning" aria-hidden="true" /> Cette aide se base
              sur votre patrimoine. Vous avez un patrimoine immobilier,
              d'épargne, des revenus fonciers et/ou du capital ? Vous devez
              renseigner des informations complémentaires.
            </span>
            <router-link
              id="patrimoine-link"
              data-testid="patrimoine-link"
              class="button outline red no-shadow text-center"
              to="/simulation/ressources/patrimoine"
            >
              Déclarez votre patrimoine
            </router-link>
          </WarningMessage>
        </div>
        <div class="aj-droit-content-buttons print-hidden">
          <div
            v-if="isString(droit.montant)"
            class="notification warning print-hidden"
          >
            <p>
              L'application Mes Aides ne peut pas calculer le montant de cette
              prestation, car
              <span v-html="droit.uncomputability[droit.montant].reason.user" />
              <br />
              <strong
                v-if="droit.uncomputability[droit.montant].solution"
                v-html="droit.uncomputability[droit.montant].solution"
              />
            </p>
          </div>
          <BenefitCta
            class="aj-droit-content-buttons-cta"
            :benefit="droit"
            :benefitsTotal="droits.length"
          />

          <a
            v-if="droit.msa"
            v-analytics="{
              name: droit.label,
              action: 'msa',
              category: 'General',
            }"
            target="_blank"
            rel="noopener"
            class="aj-droit-pro-agricole"
            href="https://www.msa.fr/lfy/espace-prive"
            title="Démarches pour les professions agricoles - Nouvelle fenêtre"
          >
            <img src="@/assets/images/doigt.svg" alt="" /> Démarches pour les
            professions agricoles
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BenefitCta from "./benefit-cta.vue"
import BenefitCtaLink from "./benefit-cta-link.vue"
import Situation from "../lib/situation"
import DroitMixin from "../mixins/droit-mixin"
import DroitHeader from "@/components/droit-header.vue"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores"

export default {
  name: "DroitsDetails",
  components: {
    WarningMessage,
    DroitHeader,
    BenefitCta,
    BenefitCtaLink,
  },
  mixins: [DroitMixin],
  props: {
    droit: Object,
    droits: Array,
    patrimoineCaptured: Boolean,
    ressourcesYearMinusTwoCaptured: Boolean,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    aCharge() {
      return Situation.aCharge(this.store.situation)
    },
  },
}
</script>
