<template>
  <a
    :id="`cta-${type}`"
    v-analytics="{ name: analyticsName, action: type, category: 'General' }"
    :aria-label="longLabel"
    :class="{
      'fr-btn fr-btn--secondary': level === 'default',
      'fr-btn': level === 'success',
    }"
    :href="getURL(link)"
    class="text-center"
    rel="noopener"
    target="_blank"
    @click="onClick(link)"
    v-html="label"
  />
</template>

<script>
import ResultatsMixin from "@/mixins/resultats.js"
import StatisticsMixin from "@/mixins/statistics.ts"
import { useStore } from "@/stores/index.ts"
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
  name: "BenefitCtaLink",
  components: {},
  mixins: [ResultatsMixin, StatisticsMixin],
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
        storageService.local.setItem("trampoline", {
          simulationId: this.store.calculs.resultats._id,
        })
      }
    },
  },
}
</script>
