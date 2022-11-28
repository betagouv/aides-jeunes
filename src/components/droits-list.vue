<template>
  <div class="droits-list">
    <div v-if="!ineligible">
      <div v-for="(droit, index) in list" :key="index" class="fr-mb-5w">
        <router-link
          class="fr-tile fr-pb-4w"
          :to="`/simulation/resultats/${droit.id}`"
          itemscope
          itemtype="http://schema.org/GovernmentService"
          :data-testid="droit.id"
          :aria-label="askBenefit(droit)"
        >
          <div class="fr-p-4w">
            <div class="aj-benefit-header fr-mb-4w">
              <img
                class="aj-institution-icon"
                :src="getBenefitImage(droit)"
                alt=""
              />
              <div class="aj-benefit-name">
                <h2 class="fr-text--lead" itemprop="name">{{
                  capitalize(droit.label)
                }}</h2>
                <div class="aj-benefit-institution"
                  >{{ capitalize(droit.institution.label) }}
                </div>
                <div>
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
              </div>
              <DroitEstime :droit="droit" />
            </div>
          </div>
        </router-link>
        <div class="fr-container fr-px-3w fr-mt-n8w">
          <div class="fr-grid-row fr-grid-row--right">
            <router-link
              :to="`/simulation/resultats/${droit.id}`"
              class="fr-btn"
              data-testid="aide-cta"
            >
              Demander cette aide
            </router-link>
          </div>
        </div>
      </div>
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
