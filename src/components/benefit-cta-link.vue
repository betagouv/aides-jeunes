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
  mixins: [ResultatsMixin],
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
      if (!this.store.calculs.resultats._id) {
        return this.benefit.link
      }
      if (typeof link === "object") {
        return this.$router.resolve(link).href
      }
    },
    onClick(link) {
      if (typeof link === "object") {
        console.log("n,n,n,n,===>", this.store.calculs.resultats._id)
        storageService.local.setItem("trampoline", {
          simulationId: this.store.calculs.resultats._id,
        })
      }
    },
  },
}
</script>
