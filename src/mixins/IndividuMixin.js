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
            getLabel: function(type) {
                const labelDict = {
                    possessif: {
                        demandeur: 'votre',
                        conjoint: 'son',
                        enfant: 'son',
                    },
                    nom: {
                        conjoint: 'votre conjoint',
                        enfant: `${this.individu._firstName}`,
                    },
                    avoir: {
                        demandeur: 'avez-vous',
                        conjoint: 'votre conjoint a-t-il/elle',
                        enfant: `${this.individu._firstName} a-t-il/elle`
                    },
                    être: {
                        demandeur: 'êtes-vous',
                        conjoint: 'votre conjoint est-il/elle',
                        enfant: `${this.individu._firstName} est-il/elle`
                    }
                }
                return labelDict[type][this.role];
            },
            onSubmit: function() {
                this.individu[props] = this.value
                this.$store.dispatch('updateIndividu', this.individu)
                this.$push()
            },
        }
    };
};
