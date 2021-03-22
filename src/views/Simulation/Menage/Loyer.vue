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
                title: 'Mon logement',
                menage: menage,
                captureCharges,
                 loyerQuestion: {
                    label: ! isLocataire ? 'Quelles sont vos mensualités ?' : 'Quel est le montant de votre loyer ?',
                    hint: ! isLocataire ? 'Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.' : null,
                    selectedValue: menage.loyer
                },
                chargesQuestion: {
                    label: 'Quel est le montant de vos charges locatives ?',
                    selectedValue: menage.charges_locatives
                }
            }
        },
        methods: {
            onSubmit: function() {
                if (this.loyerQuestion.selectedValue === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.loyer = this.loyerQuestion.selectedValue
                if (this.captureCharges) {
                    this.menage.charges_locatives = this.chargesQuestion.selectedValue
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
        display: block;
        font-size: 0.8em;
    }

    fieldset {
        margin-bottom: 2em;
    }
</style>
