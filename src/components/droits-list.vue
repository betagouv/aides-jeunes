<template>
  <div class="droits-list">
    <div v-if="!ineligible">
      <router-link
        v-for="(droit, index) in list"
        :key="index"
        class="fr-tile fr-enlarge-link fr-tile--horizontal fr-mb-5w"
        :to="`/simulation/resultats/${droit.id}`"
        itemscope
        itemtype="http://schema.org/GovernmentService"
        :data-testid="droit.id"
        :aria-label="askBenefit(droit)"
      >
        <div class="fr-tile__body">
          <div class="fr-container fr-px-0 fr-mb-1w">
            <div class="fr-grid-row fr-grid-row--gutters">
              <div class="fr-col-1">
                <img
                  class="aj-institution-icon"
                  :src="getBenefitImage(droit)"
                  alt=""
                />
              </div>
              <div class="fr-col-8 fr-pl-3w">
                <h2 class="fr-tile__title" itemprop="name">{{
                  capitalize(droit.label)
                }}</h2>
                <div class="fr-hint-text"
                  >{{ capitalize(droit.institution.label) }}
                </div>
                <p class="fr-text--justify" v-html="droit.description" />
                <WarningMessage
                  v-if="
                    droit.montant &&
                    isBoolean(droit.montant) &&
                    droit.warning === true
                  "
                >
                  <img src="@/assets/images/warning.svg" alt="" /> Attention,
                  cette aide vous est accessible sous certaines conditions
                  supplémentaires.
                </WarningMessage>
              </div>
              <div class="fr-col-3">
                <DroitEstime :droit="droit" />
              </div>
            </div>
          </div>
          <div class="fr-container fr-px-0">
            <div class="fr-grid-row fr-grid-row--right">
              <button class="fr-btn" data-testid="aide-cta">
                Demander cette aide
              </button>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div v-else>
      <a
        v-for="(droit, index) in list"
        :key="index"
        v-analytics="{
          name: droit.label,
          action: 'link-ineligible',
          category: 'General',
        }"
        class="droits-list-item"
        :href="droit.link"
        target="_blank"
        rel="noopener"
        itemscope
        itemtype="http://schema.org/GovernmentService"
      >
        <div class="droits-list-item-cell">
          <div class="droits-list-item-cell-left">
            <img :src="getBenefitImage(droit)" alt="" />
            <div>
              <h2>
                <div itemprop="name">{{ droit.label }}</div>
                <small
                  :aria-label="`Plus d'informations sur ${droit.label} - Nouvelle fenêtre`"
                  >Plus d'informations</small
                >
              </h2>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import DroitMixin from "@/mixins/droit-mixin"
import DroitEstime from "./droit-estime.vue"
import BenefitMixin from "@/mixins/benefit-image-mixin"
import WarningMessage from "@/components/warning-message.vue"

export default {
  name: "DroitsList",
  components: {
    WarningMessage,
    DroitEstime,
  },
  mixins: [DroitMixin, BenefitMixin],
  props: {
    droits: Array,
    ineligible: Boolean,
    filter: Array,
  },
  data: function () {
    return {}
  },
  computed: {
    list: function () {
      return this.droits.filter((value) => {
        return !this.filter || this.filter.includes(value.id)
      })
    },
  },
  methods: {
    push: function (droit) {
      this.$router.push(`/simulation/resultats/${droit.id}`)
    },
    askBenefit: function (droit) {
      return `Demander ${droit.prefix}${droit.prefix == "l’" ? "" : " "}${
        droit.label
      }`
    },
  },
}
</script>
