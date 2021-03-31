<template>
    <form @submit.prevent='onSubmit'>
        <fieldset>
            <YesNoQuestion v-model="value">
                Avez-vous un lien de parenté direct avec votre propriétaire ?
            </YesNoQuestion>
            <span class="help">(Est-il un ascendant ou descendant de vous ou votre conjoint·e (enfant, grand-parent…) ?)</span>
        </fieldset>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import YesNoQuestion from '@/components/YesNoQuestion'
    import { createFamilleMixin } from '@/mixins/FamilleMixin'

    export default {
        name: 'SimulationMenageLogementChambre',
        components: {
            Actions,
            YesNoQuestion,
        },
        mixins: [
            createFamilleMixin('proprietaire_proche_famille')
        ],
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
