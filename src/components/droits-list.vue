<template>
  <div class="droits-list">
    <div v-if="!ineligible">
      <router-link
        v-for="(droit, index) in list"
        :key="index"
        :aria-label="askBenefit(droit)"
        :data-testid="droit.id"
        :to="`/simulation/resultats/${droit.id}`"
        class="aj-aide-box a-unstyled"
        itemscope
        itemtype="http://schema.org/GovernmentService"
      >
        <img
          :src="getBenefitImage(droit)"
          alt=""
          class="aj-aide-illustration"
        />
        <div class="aj-aide-text">
          <h2 class="aj-question aj-benefit-label" itemprop="name">{{
            capitalize(droit.label)
          }}</h2>
          <div class="aj-institution-label"
            >{{ capitalize(droit.institution.label) }}
          </div>
          <p class="aj-aide-description" v-html="droit.description" />
          <WarningMessage
            v-if="
              droit.montant &&
              isBoolean(droit.montant) &&
              droit.warning === true
            "
          >
            <img alt="" src="@/assets/images/warning.svg" /> Attention, cette
            aide vous est accessible sous certaines conditions supplémentaires.
          </WarningMessage>
          <router-link
            v-if="
              droit.isBaseRessourcesYearMinusTwo &&
              store.simulation?.ressourcesFiscales
            "
            class="button outline red text-center small"
            to="/simulation/ressources/fiscales"
          >
            Modifier vos revenus fiscaux
          </router-link>
        </div>
        <DroitEstime :droit="droit" />

        <div class="aj-aide-cta" data-testid="aide-cta">
          <button class="button primary"> Demander cette aide</button>
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
        :href="droit.link"
        class="droits-list-item"
        itemscope
        itemtype="http://schema.org/GovernmentService"
        rel="noopener"
        target="_blank"
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
import { useStore } from "@/stores"

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
    return { store: useStore() }
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
