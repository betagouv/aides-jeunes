<template>
  <a
    v-bind:href="getURL(link)"
    target="_blank"
    rel="noopener"
    class="text-center"
    v-bind:class="{
      'button secondary': level === 'default',
      'button primary': level === 'success',
    }"
    v-on:click="onClick(link)"
    v-analytics="{ name: analyticsName, action: type, category: 'General' }"
    v-bind:aria-label="longLabel"
    v-html="label"
  >
  </a>
</template>

<script>
import StatisticsMixin from "@/mixins/Statistics"

let typeLabels = {
  teleservice: "Faire une demande en ligne",
  form: "Accéder au formulaire papier",
  instructions: "Accéder aux instructions",
  link: "Plus d'informations <i class='fa fa-external-link' aria-hidden='true' role='presentation'></i>",
}

let longLabels = {
  ...typeLabels,
  link: "Plus d'informations",
}

export default {
  name: "BenefitCtaLink",
  props: {
    analyticsName: String,
    benefit: Object,
    level: String,
    type: String,
    link: [String, Object],
  },
  mixins: [StatisticsMixin],
  components: {},
  data: function () {
    return {}
  },
  computed: {
    label: function () {
      return typeLabels[this.type]
    },
    longLabel: function () {
      return `${longLabels[this.type]} pour ${this.benefit.prefix}${
        this.benefit.prefix && this.benefit.prefix.endsWith("’") ? "" : " "
      }${this.benefit.label}`
    },
  },
  methods: {
    getURL: function (link) {
      if (typeof link === "object") {
        return this.$router.resolve(link).href
      }

      return link
    },
    onClick: function (link) {
      const id = this.matomo ? this.$matomo.getVisitorId() : undefined
      this.sendStatistics([this.benefit], id, "clicked")
      if (typeof link === "object") {
        window.localStorage.setItem(
          "trampoline",
          JSON.stringify({
            situationId: this.$store.state.calculs.resultats._id,
          })
        )
      }
    },
  },
}
</script>
