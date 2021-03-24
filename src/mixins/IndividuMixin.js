import Individu from '@/lib/Individu'

const autoValidatedSteps = [
    'activite',
    'nationalite',
    'handicap',
    'inapte_travail',
    'garde_alterne',
    'handicap',
    'enfant_a_charge',
    'taux_incapacite',
    'ass_precondition_remplie',
    'aah_restriction_substantielle_durable_acces_emploi',
    'enfant_place'
];

export const createIndividuMixin = (props, optional) => {
    return {
        data: function() {
            const id = this.$route.params.id
            const role = id.split('_')[0]
            const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
            const autoValidate = autoValidatedSteps.includes(props)
            const value = individu[props]
            return {
                error: false,
                individu,
                id,
                value,
                role,
                autoValidate,
                optional
            }
        },
        watch: {
           value() {
                if (this.autoValidate) {
                    setTimeout(this.onSubmit, 400)
                }
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
            requiredValueMissing: function() {
                const hasError = !this.optional && this.value === undefined
                this.$store.dispatch('updateError', hasError && 'Ce champ est obligatoire.')
                return hasError
            },
            onSubmit: function() {
                if (this.requiredValueMissing()) {
                    return
                }
                this.individu[props] = this.value
                this.$store.dispatch('updateIndividu', this.individu)
                this.$push()
            },
        }
    };
};
