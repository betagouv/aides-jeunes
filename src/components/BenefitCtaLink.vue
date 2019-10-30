<template>
    <a v-bind:href="getURL(link)"
    target="_blank"
    rel="noopener"
    class="text-center" 
    v-bind:class="{
      'button secondary': level === 'default',
      'button primary': level === 'success' }"
    v-on:click="onClick(link)"
    analytics-on="click"
    v-bind:analytics-name="analyticsName"
    v-bind:analytics-event="type"
    analytics-category="General"
    v-bind:aria-label="longLabel"
    v-html="label">
  </a>
</template>

<script>
var typeLabels = {
    teleservice: 'Faire une demande en ligne',
    form: 'Accéder au formulaire papier',
    instructions: 'Accéder aux instructions',
    link: "Plus d'informations <i class='fa fa-external-link' aria-hidden='true' role='presentation'></i>",
};

var longLabels = {
  ...typeLabels,
  link: "Plus d'informations"
}

export default {
  name: 'BenefitCtaLink',
  props: {
    analyticsName: String,
    benefit: Object,
    level: String,
    type: String,
    link: [String, Object],
  },
  components: {
  },
  data: function() {
    return {
    }
  },
  computed: {
    label: function() {
      return typeLabels[this.type]
    },
    longLabel: function() {
      return `${longLabels[this.type]} pour ${ this.benefit.prefix }${ this.benefit.prefix && this.benefit.prefix.endsWith('’') ? '' : ' ' }${ this.benefit.label }`
    },
  },
  methods: {
    getURL: function(link) {
      if (typeof link === 'object') {
        return 'TODO'
      }

      return link;
    },
    onClick: function(link) {
      if (typeof link === 'object') {
        alert('TODO')
        /*
        var situation = SituationService.restoreLocal()
        TrampolineService.set({ situationId: situation._id })
        //*/
      }
    },
  },
}

</script>
