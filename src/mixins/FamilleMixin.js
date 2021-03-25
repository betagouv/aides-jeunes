import { autoSubmitMixin } from '@/mixins/AutoSubmit'

export const createFamilleMixin = (props, optional, manualValidation) => {
    return {
        mixins: [autoSubmitMixin('value', manualValidation)],
        data: function() {
            const famille = this.$store.state.situation.famille
            const value = famille[props]
            return {
              famille,
              value,
            }
          },
          methods: {
            onSubmit: function() {
              if (!optional && this.value === undefined) {
                this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                return
              }
              this.famille[props] = this.value
              this.$store.dispatch('updateFamille', this.famille)
              this.$push()
            }
          }
    };
};
