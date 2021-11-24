<template>
  <a
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
  props: {
    analyticsName: String,
    benefit: Object,
    level: String,
    type: String,
    link: [String, Object],
  },
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
