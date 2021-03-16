<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label>{{ loyerQuesition.label }}</label>
            <input type="number" v-model="loyerQuesition.selectedValue">
            <span class="help">{{ loyerQuesition.hint }}</span>
        </fieldset>
        <fieldset>
            <label>{{ chargesQuesition.label }}</label>
            <input type="number" v-model="chargesQuesition.selectedValue">
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
            const foyerFiscal = this.$store.getters.getFoyerFiscal || {}
            const logementStatut = this.$store.getters.getLogementStatut || ''
            const isProprietaire = (logementStatut === 'proprietaire' || logementStatut === 'primo_accedant')
            return {
                title: 'Votre logement principal',
                menage: menage,
                foyerFiscal: foyerFiscal,
                isProprietaire: isProprietaire,
                loyerQuesition: {
                    label: isProprietaire ? 'Montant des mensualités' : 'Votre loyer',
                    hint: isProprietaire ? 'Laissez ce champ à 0 € si vous ne remboursez pas actuellement de crédit pour votre logement.' : null,
                    selectedValue: parseInt(menage.loyer)
                },
                chargesQuesition: {
                    label: isProprietaire ? 'Montant de votre dernière taxe foncière' : 'Vos charges locatives',
                    selectedValue: isProprietaire ? parseInt(foyerFiscal.taxe_fonciere_sur_avis) : parseInt(menage.charges_locatives)
                }
            }
        },
        methods: {
            onSubmit: function() {
                this.menage.loyer = this.loyerQuesition.selectedValue.toString()
                if (this.isProprietaire) {
                    this.foyerFiscal.taxe_fonciere_sur_avis = this.chargesQuesition.selectedValue.toString()
                    this.$store.dispatch('updateFoyerFiscal', this.foyerFiscal)
                } else {
                    this.menage.charges_locatives = this.chargesQuesition.selectedValue.toString()
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
