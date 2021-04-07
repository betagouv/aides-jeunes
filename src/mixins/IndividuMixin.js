import Individu from '@/lib/Individu'
import { autoSubmitMixin } from '@/mixins/AutoSubmit'

export const createIndividuMixin = (props) => {
    const { fieldName = props, optional = false, manualValidation = false } = props

    return {
        data: function() {
            const id = this.$route.params.id
            const role = id.split('_')[0]
            const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
            const value = individu[fieldName]
            return {
                error: false,
                fieldName,
                individu,
                id,
                value,
                role,
                optional
            }
        },
        mixins: [autoSubmitMixin({fieldName: 'value', manualValidation})],
        methods: {
            getLabel: function(type) {
                return Individu.label(this.individu, type)
            },
            requiredValueMissing: function() {
                const hasError = !this.optional && this.value === undefined
                this.$store.dispatch('updateError', hasError && 'Ce champ est obligatoire.')
                return hasError
            },
            onSubmit: function() {
                if (this.requiredValueMissing()) {
                    return
                }
                this.individu[fieldName] = this.value
                this.$store.dispatch('updateIndividu', this.individu)
                this.$push()
            },
        }
    };
};
