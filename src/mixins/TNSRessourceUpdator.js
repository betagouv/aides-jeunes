export default {
  props: {
    ressource: Object,
  },
  methods: {
    update: function(month, value) {
      this.$emit('update', this.ressource, month, value)
    },
    updateExtra: function(item, value) {
      this.$emit('updateExtra', this.ressource, item, value)
    }
  }
}
