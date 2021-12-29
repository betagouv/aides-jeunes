<template>
  <div class="droits-list">
    <div v-if="!ineligible">
      <router-link
        v-for="(droit, index) in list"
        :key="index"
        class="aj-aide-box a-unstyled"
        :to="`/simulation/resultats/${droit.id}`"
        itemscope
        itemtype="http://schema.org/GovernmentService"
        :data-testid="droit.id"
      >
        <img
          class="aj-aide-illustration"
          :src="require(`./../../public/img/${droit.institution.imgSrc}`)"
          :alt="'Logo ' + droit.label"
        />
        <div class="aj-aide-text">
          <h2 class="aj-question aj-benefit-label" itemprop="name">{{
            capitalize(droit.label)
          }}</h2>
          <div class="aj-institution-label">{{
            capitalize(droit.institution.label)
          }}</div>
          <p class="aj-aide-description" v-html="droit.description" />
          <div
            v-if="
              droit.montant &&
              isBoolean(droit.montant) &&
              droit.icon === 'fa-exclamation-triangle'
            "
            class="aj-aide-warning"
          >
            <img src="@/assets/images/warning.svg" /> Attention, cette aide vous
            est accessible sous certaines conditions supplémentaires.
          </div>
        </div>
        <DroitEstime :droit="droit" />
        <div class="aj-aide-cta">
          <button class="button primary"> Demander cette aide </button>
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
            <img
              :src="require(`./../../public/img/${droit.institution.imgSrc}`)"
              :alt="'Icone pour' + droit.label"
            />
            <div>
              <h2>
                <div itemprop="name">{{ droit.label }}</div>
                <small :aria-label="`Plus d'informations sur ${droit.label}`"
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
import DroitMixin from "../mixins/droit-mixin"
import DroitEstime from "./droit-estime"

export default {
  name: "DroitsList",
  components: {
    DroitEstime,
  },
  mixins: [DroitMixin],
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
      console.log(this.droits)
      return this.droits.filter((value) => {
        return !this.filter || this.filter.includes(value.id)
      })
    },
  },
  methods: {
    push: function (droit) {
      this.$router.push(`/simulation/resultats/${droit.id}`)
    },
  },
}
</script>
