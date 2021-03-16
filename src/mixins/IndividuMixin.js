import Individu from '@/lib/Individu'

export const createIndividuMixin = (props) => {
    return {
        data: function() {
            const id = this.$route.params.id
            const role = id.split('_')[0]
            const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
            const value = individu[props]
            return {
                individu,
                id,
                value,
                role
            }
        },
        methods: {
            onSubmit: function() {
                this.individu[props] = this.value
                this.$store.dispatch('updateIndividu', this.individu)
                this.$push()
            },
        }
    };
};
