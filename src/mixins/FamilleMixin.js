import { autoSubmitMixin } from '@/mixins/AutoSubmit'

export const createFamilleMixin = (props) => {
    const { fieldName = props, optional = false, manualValidation = false } = props

    return {
        mixins: [autoSubmitMixin({fields: [{name: 'value'}], manualValidation})],
        data: function() {
            const famille = {...this.$store.state.situation.famille}
            const value = famille[fieldName]
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
              this.famille[fieldName] = this.value
              this.$store.dispatch('updateFamille', this.famille)
              this.$push()
            }
          }
    };
};
