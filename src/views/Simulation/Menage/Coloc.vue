<template>
    <form @submit.prevent='onSubmit'>
        <YesNoQuestion v-model="value">
            Est-ce une colocation ?
        </YesNoQuestion>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import YesNoQuestion from '@/components/YesNoQuestion'

    export default {
        name: 'SimulationMenageColoc',
        components: {
            YesNoQuestion,
            Actions
        },
        data: function() {
            const menage = { ...this.$store.getters.getMenage || {} }
            return {
                menage: menage,
                value: menage.coloc
            }
        },
        methods: {
            onSubmit: function() {
                if (this.value === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.coloc = this.value
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
