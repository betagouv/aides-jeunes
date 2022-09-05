<template>
  <a
    :id="`cta-${type}`"
    v-analytics="{ name: analyticsName, action: type, category: 'General' }"
    :href="getURL(link)"
    target="_blank"
    rel="noopener"
    class="text-center"
    :class="{
      'button secondary': level === 'default',
      'button primary': level === 'success',
    }"
    :aria-label="longLabel"
    @click="onClick(link)"
    v-html="label"
  />
</template>

<script>
import StatisticsMixin from "@/mixins/statistics"
import { useStore } from "@/stores"

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
  components: {},
  mixins: [StatisticsMixin],
  props: {
    analyticsName: String,
    benefit: Object,
    level: String,
    type: String,
    link: [String, Object],
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {}
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
        window.localStorage.setItem(
          "trampoline",
          JSON.stringify({
            situationId: this.store.calculs.resultats._id,
          })
        )
      }
    },
  },
}
</script>
