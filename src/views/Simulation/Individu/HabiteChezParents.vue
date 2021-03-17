<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <legend>
                {{ habiteChezParentsQuestion.label }}
                <span v-if="habiteChezParentsQuestion.hint" class="help">({{ habiteChezParentsQuestion.hint }})</span>
            </legend>
            <label v-for="response in habiteChezParentsQuestion.responses" v-bind:key="response.value">
                <input type="radio" name="coloc" v-model="habiteChezParentsQuestion.selectedValue" v-bind:value="response.value"
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
        name: 'SimulationIndividuHabiteChezParents',
        components: {
            Actions
        },
        data: function() {
            const individu = this.$store.getters.getIndividu(this.$route.params.id) || {}
            return {
                title: 'Votre logement principal',
                individu: individu,
                habiteChezParentsQuestion: {
                    label: 'Êtes vous hébergé chez vos parents ?',
                    selectedValue: individu.habite_chez_parents,
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
                this.individu.habite_chez_parents = this.habiteChezParentsQuestion.selectedValue
                this.$store.dispatch('updateIndividu', this.individu)
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
