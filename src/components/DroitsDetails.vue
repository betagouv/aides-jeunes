<template>
  <div
    class="aj-droit-detail normal-padding-bottom"
    itemscope
    itemtype="http://schema.org/GovernmentService"
  >
    <div class="aj-droit-identity">
      <img
        class="aj-droit-illustration"
        v-bind:src="require(`./../../public/img/${droit.provider.imgSrc}`)"
        v-bind:alt="'Image pour ' + droit.label"
      />
      <h2 class="aj-question" itemprop="name">{{ capitalize(droit.label) }}</h2>
    </div>
    <div class="aj-droit-montant">
      <DroitEstime v-bind:droit="droit" />
    </div>
    <div class="aj-droit-content">
      <h2 class="aj-question" itemprop="name">{{ droit.label }}</h2>
      <div class="aj-droit-content-heading">
        <div class="aj-droit-content-description">
          <p>
            <span v-html="droit.description" itemprop="description"></span>
            <BenefitCtaLink
              v-if="droit.link"
              v-bind:analytics-name="droit.label"
              v-bind:link="droit.link"
              v-bind:benefit="droit"
              type="link"
              level="'inline'"
              itemprop="termsOfService"
            />
          </p>
          <div v-if="droit.conditions" class="aj-droit-conditions">
            <p class="aj-droit-conditions-title"
              >Pour en bénéficier, vous devez également :</p
            >
            <ul class="list-unstyled">
              <li
                v-for="(condition, index) in droit.conditions"
                v-bind:key="index"
              >
                <img src="@/assets/images/doigt.svg" />
                <span v-html="condition"></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="aj-droit-notifications">
          <div
            class="notification warning print-hidden"
            v-if="
              droit.isBaseRessourcesYearMinusTwo &&
              !ressourcesYearMinusTwoCaptured &&
              !isString(droit.montant)
            "
          >
            <span>
              <i class="fa fa-warning" aria-hidden="true"></i>  Cette aide se
              base sur vos ressources de l'année
              {{ $store.state.dates.fiscalYear.label }}
            </span>
            <router-link
              class="button outline red no-shadow text-center"
              to="/simulation/ressources/fiscales"
              v-if="!aCharge"
              >Déclarez vos ressources
              {{ $store.state.dates.fiscalYear.label }}</router-link
            >
          </div>
          <div
            class="notification warning print-hidden"
            v-if="
              droit.isBaseRessourcesPatrimoine &&
              !patrimoineCaptured &&
              !isString(droit.montant)
            "
          >
            <span>
              <i class="fa fa-warning" aria-hidden="true"></i> Cette aide se
              base sur votre patrimoine. Vous avez un patrimoine immobilier,
              d'épargne, des revenus fonciers et/ou du capital ? Vous devez
              renseigner des informations complémentaires.
            </span>
            <router-link
              class="button outline red no-shadow text-center"
              to="/simulation/ressources/patrimoine"
              id="patrimoine-link"
              >Déclarez votre patrimoine</router-link
            >
          </div>
        </div>
        <div class="aj-droit-content-buttons print-hidden">
          <div
            class="notification warning print-hidden"
            v-if="isString(droit.montant)"
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
            v-bind:benefit="droit"
          ></BenefitCta>

          <a
            v-if="droit.msa"
            target="_blank"
            rel="noopener"
            class="aj-droit-pro-agricole"
            href="https://www.msa.fr/lfy/espace-prive"
            v-analytics="{
              name: droit.label,
              action: 'msa',
              category: 'General',
            }"
          >
            <img src="@/assets/images/doigt.svg" /> Démarches pour les
            professions agricoles
          </a>

          <div class="is-align-vertically-center">
            <a
              class="text-center"
              @click="alertBrokenLink()"
              v-if="brokenLinkButtonState === 'show'"
              >Lien invalide ?</a
            >
            <span
              class="text-center"
              v-else-if="brokenLinkButtonState === 'showThanksMessage'"
              >Merci pour votre aide ! Nous réglerons ce problème très
              prochainement.</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BenefitCta from "./BenefitCta"
import BenefitCtaLink from "./BenefitCtaLink"
import DroitEstime from "./DroitEstime"
import Situation from "../lib/Situation"
import DroitMixin from "../mixins/DroitMixin"

export default {
  name: "DroitsDetails",
  props: {
    droit: Object,
    patrimoineCaptured: Boolean,
    ressourcesYearMinusTwoCaptured: Boolean,
  },
  components: {
    BenefitCta,
    BenefitCtaLink,
    DroitEstime,
  },
  mixins: [DroitMixin],
  data() {
    return {
      brokenLinkButtonState: "show",
    }
  },
  computed: {
    aCharge() {
      return Situation.aCharge(this.$store.getters.situation)
    },
  },
  methods: {
    alertBrokenLink() {
      this.brokenLinkButtonState = "showThanksMessage"
      setTimeout(() => (this.brokenLinkButtonState = null), 5000)
      this.$matomo.trackEvent(
        "General",
        "Erreur lien aide invalide",
        this.droit.label
      )
    },
  },
}
</script>
