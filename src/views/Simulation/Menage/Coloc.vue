<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label>{{ colocQuestion.label }}</label>
            <label v-for="response in colocQuestion.responses" v-bind:key="response.value">
                <input type="radio" name="coloc" v-model="colocQuestion.selectedValue" v-bind:value="response.value"
                />
                {{ response.label | capitalize }}
                <span v-if="response.hint" class="help">({{ response.hint }})</span>
            </label>
        </fieldset>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'

    export default {
        name: 'SimulationMenageColoc',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                title: 'Votre logement principal',
                menage: menage,
                colocQuestion: {
                    label: 'Est-ce une colocation ?',
                    selectedValue: menage.coloc,
                    responses: [
                        {
                            label: 'Oui',
                            value: true
                        },
                        {
                            label: 'Non',
                            value: false
                        }
                    ]
                }
            }
        },
        methods: {
            onSubmit: function() {
                this.menage.coloc = this.colocQuestion.selectedValue
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
