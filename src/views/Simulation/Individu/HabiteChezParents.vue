<template>
    <form @submit.prevent='onSubmit'>
        <YesNoQuestion v-model="value">
            Êtes vous hébergé chez vos parents ?
        </YesNoQuestion>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import { autoSubmitMixin } from '@/mixins/AutoSubmit';
    import YesNoQuestion from "../../../components/YesNoQuestion";

    export default {
        name: 'SimulationIndividuHabiteChezParents',
        components: {
            YesNoQuestion,
            Actions
        },
        data: function() {
            const individu = this.$store.getters.getIndividu(this.$route.params.id) || {}
            return {
                individu: individu,
                value: individu.habite_chez_parents
            }
        },
        mixins: [autoSubmitMixin('value')],
        methods: {
            onSubmit: function() {
                if (this.value === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.individu.habite_chez_parents = this.value
                this.$store.dispatch('updateIndividu', this.individu)
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
