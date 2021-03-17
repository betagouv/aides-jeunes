<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label>{{  loyerQuestion.label }}
                <input type="number" v-model=" loyerQuestion.selectedValue">
                <span class="help">{{  loyerQuestion.hint }}</span>
            </label>
        </fieldset>
        <fieldset v-if="captureCharges">
            <label>{{ chargesQuestion.label }}
                <input type="number" v-model="chargesQuestion.selectedValue">
            </label>
        </fieldset>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'

    export default {
        name: 'SimulationMenageDepCom',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            const logementStatut = this.$store.getters.getLogementStatut || ''
            const isLocataire = !(logementStatut === 'proprietaire' || logementStatut === 'primo_accedant')
            const captureCharges = isLocataire && logementStatut != 'locataire_meuble'
            return {
                title: 'Votre logement principal',
                menage,
                captureCharges,
                loyerQuestion: {
                    label: isLocataire ? 'Votre loyer' : 'Montant des mensualités',
                    hint: !isLocataire ? 'Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.' : null,
                    selectedValue: parseInt(menage.loyer)
                },
                chargesQuestion: {
                    label: 'Vos charges locatives',
                    selectedValue: parseInt(menage.charges_locatives)
                }
            }
        },
        methods: {
            onSubmit: function() {
                this.menage.loyer = this. loyerQuestion.selectedValue.toString()
                if (this.captureCharges) {
                    this.menage.charges_locatives = this.chargesQuestion.selectedValue.toString()
                }
                this.$store.dispatch('updateMenage', this.menage)
                this.$push()
            }
        }
    }
</script>

<style scoped lang="scss">
    span.help {
        font-style: italic;
    }

    fieldset {
        margin-bottom: 2em;
    }
</style>
