<template>
    <form @submit.prevent='onSubmit'>
        <YesNoQuestion v-model="value">
            Participez-vous aux frais du logement ?
            <span class="help">Par exemple aux dépenses d'électricité, de téléphone, etc.</span>
        </YesNoQuestion>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import { autoSubmitMixin } from '@/mixins/AutoSubmit';
    import YesNoQuestion from '@/components/YesNoQuestion';

    export default {
        name: 'SimulationMenageParticipationFrais',
        components: {
            YesNoQuestion,
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                menage: menage,
                value: menage.participation_frais
            }
        },
        mixins: [autoSubmitMixin('value')],
        methods: {
            onSubmit: function() {
                if (this.value === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.participation_frais = this.value
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
