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

export default {
  name: 'BenefitCtaLink',
  props: {
    analyticsName: String,
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
    label: function() { return typeLabels[this.type] },
    list: function() {
      let vm = this
      return _.filter(this.droits, function(value) {
        return (!vm.filter) ||_.includes(vm.filter, value.id)
      })
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
