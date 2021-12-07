<template>
  <div class="droits-list">
    <div v-if="!ineligible">
      <router-link
        v-for="(droit, index) in list"
        class="aj-aide-box a-unstyled"
        v-bind:key="index"
        v-bind:to="`/simulation/resultats/${droit.id}`"
        itemscope
        itemtype="http://schema.org/GovernmentService"
      >
        <img
          class="aj-aide-illustration"
          v-bind:src="require(`./../../public/img/${droit.institution.imgSrc}`)"
          v-bind:alt="'Logo ' + droit.label"
        />
        <div class="aj-aide-text">
          <h2 class="aj-question" itemprop="name">{{
            capitalize(droit.label)
          }}</h2>
          <p class="aj-aide-description" v-html="droit.description"></p>
          <div
            class="aj-aide-warning"
            v-if="
              droit.montant &&
              isBoolean(droit.montant) &&
              droit.icon === 'fa-exclamation-triangle'
            "
          >
            <img src="@/assets/images/warning.svg" /> Attention, cette aide vous
            est accessible sous certaines conditions supplémentaires.
          </div>
        </div>
        <DroitEstime :droit="droit" />
        <div class="aj-aide-cta">
          <button class="button primary">Demander cette aide</button>
        </div>
      </router-link>
    </div>
    <div v-else>
      <a
        v-for="(droit, index) in list"
        class="droits-list-item"
        v-bind:href="droit.link"
        target="_blank"
        rel="noopener"
        itemscope
        itemtype="http://schema.org/GovernmentService"
        v-analytics="{
          name: droit.label,
          action: 'link-ineligible',
          category: 'General',
        }"
        v-bind:key="index"
      >
        <div class="droits-list-item-cell">
          <div class="droits-list-item-cell-left">
            <img
              v-bind:src="
                require(`./../../public/img/${droit.institution.imgSrc}`)
              "
              v-bind:alt="'Icone pour' + droit.label"
            />
            <div>
              <h2>
                <div itemprop="name">{{ droit.label }}</div>
                <small
                  v-bind:aria-label="`Plus d'informations sur ${droit.label}`"
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
import DroitMixin from "../mixins/DroitMixin"
import DroitEstime from "./DroitEstime"

export default {
  name: "DroitsList",
  props: {
    droits: Array,
    ineligible: Boolean,
  },
  mixins: [DroitMixin],
  components: {
    DroitEstime,
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
    longCta: function (benefit) {
      return `Comment obtenir ${benefit.prefix}${
        benefit.prefix && benefit.prefix.endsWith("’") ? "" : " "
      }${benefit.label} ?`
    },

    scrollTo: function (event, droit) {
      return this.$ScrollService.go(event, document.getElementById(droit.id))
    },
    push: function (droit) {
      this.$router.push(`/simulation/resultats/${droit.id}`)
    },
  },
}
</script>
