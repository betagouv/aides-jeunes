<template>
    <form @submit.prevent='onSubmit'>
        <YesNoQuestion v-model="value">
            Est-ce une chambre ?
            <span class="help">
                Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
            </span>
        </YesNoQuestion>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import { autoSubmitMixin } from '@/mixins/AutoSubmit'
    import YesNoQuestion from '@/components/YesNoQuestion'

    export default {
        name: 'SimulationMenageLogementChambre',
        components: {
            YesNoQuestion,
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                menage: menage,
                value: menage.logement_chambre
            }
        },
        mixins: [autoSubmitMixin('value')],
        methods: {
            onSubmit: function() {
                if (this.value === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.logement_chambre = this.value
                this.$store.dispatch('updateMenage', this.menage)
                this.$push()
            }
        }
    }
</script>

<style scoped lang="scss">
    fieldset {
        margin-bottom: 2em;
    }
</style>
