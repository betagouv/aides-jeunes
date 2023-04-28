<template>
  <div class="fr-container fr-px-0 fr-mb-0 fr-py-2w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <ul
        v-for="(cta, index) in ctas"
        :key="index"
        class="fr-col-6 fr-btns-group fr-mx-0 fr-py-0 fr-px-0"
      >
        <li>
          <BenefitCtaLink
            :analytics-name="benefit.id"
            :benefit="benefit"
            :link="cta.link"
            :type="cta.type"
            :level="levels[index]"
          /> </li
      ></ul>
      <ul
        v-if="showProximityCta"
        class="fr-col fr-btns-group fr-mx-0 fr-py-0 fr-px-0"
      >
        <li>
          <AnalyticRouterLink
            id="cta-proximity"
            class="fr-btn"
            :analytics="{
              name: benefit.id,
              action: eventTypeShowLocations,
              category: 'General',
            }"
            :to="{
              name: 'resultatsLieuxDedies',
              params: { benefit_id: benefit.id },
            }"
            >À proximité de chez vous
          </AnalyticRouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BenefitCtaLink from "./benefit-cta-link.vue"
import { hasEtablissements } from "@lib/benefits/etablissements.ts"
import AnalyticRouterLink from "@/components/buttons/analytic-router-link.vue"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.ts"
import storageService from "@/lib/storage-service.ts"

let typeLabels = {
  teleservice: "Faire une demande en ligne",
  form: "Accéder au formulaire papier",
  instructions: "Accéder aux instructions",
  link: "Plus d'informations",
}

let longLabels = {
  ...typeLabels,
  link: "Plus d'informations",
}

export default {
  name: "BenefitCta",
  components: {
    BenefitCtaLink,
    AnalyticRouterLink,
  },
  props: {
    benefit: Object,
  },
  data: function () {
    return {
      levels: ["success", "default"],
      eventTypeShowLocations: BehaviourEventTypes.showLocations,
    }
  },
  computed: {
    label() {
      return typeLabels[this.type]
    },
    longLabel() {
      return `${longLabels[this.type]} pour ${this.benefit.prefix || ""}${
        this.benefit.prefix?.endsWith("’") ? "" : " "
      }${this.benefit.label} - Nouvelle fenêtre`
    },
  },
  methods: {
    getURL(link) {
      if (typeof link === "object") {
        return this.$router.resolve(link).href
      }
      return link
    },
    onClick(link) {
      if (typeof link === "object") {
        storageService.local.setItem("trampoline", {
          simulationId: this.store.calculs.resultats._id,
        })
      }
    },
    ctas() {
      const ctaBehaviourTypes = [
        BehaviourEventTypes.teleservice,
        BehaviourEventTypes.form,
        BehaviourEventTypes.instructions,
      ]
      return ctaBehaviourTypes
        .map((type) => {
          const linkGenerator = this.benefit[`${type}Generator`]
          const link = this.benefit[type] || (linkGenerator && linkGenerator())
          return {
            type,
            link,
          }
        })
        .filter(function (item) {
          return item.link
        })
        .slice(0, 2)
    },
    showProximityCta() {
      return hasEtablissements(this.benefit) && this.$route.name !== "aide"
    },
  },
}
</script>
