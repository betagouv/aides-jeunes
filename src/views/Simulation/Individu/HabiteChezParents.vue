<template>
    <form @submit.prevent='onSubmit'>
        <fieldset>
            <legend>
                <h2 class="aj-question">
                    {{ habiteChezParentsQuestion.label }}
                    <span v-if="habiteChezParentsQuestion.hint" class="help">({{ habiteChezParentsQuestion.hint }})</span>
                </h2>
            </legend>
            <div v-for="response in habiteChezParentsQuestion.responses" class="aj-selection-wrapper" v-bind:key="response.value">
                <input :id="response.label" type="radio" name="coloc" v-model="habiteChezParentsQuestion.selectedValue" v-bind:value="response.value"
                />
                <label :for="response.label">
                    {{ response.label | capitalize }}
                    <span v-if="response.hint" class="help">({{ response.hint }})</span>
                </label>
            </div>
        </fieldset>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import { autoSubmitMixin } from '@/mixins/AutoSubmit';

    export default {
        name: 'SimulationIndividuHabiteChezParents',
        components: {
            Actions
        },
        data: function() {
            const individu = this.$store.getters.getIndividu(this.$route.params.id) || {}
            return {
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
        mixins: [autoSubmitMixin('habiteChezParentsQuestion.selectedValue')],
        methods: {
            onSubmit: function() {
                if (this.habiteChezParentsQuestion.selectedValue === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.individu.habite_chez_parents = this.habiteChezParentsQuestion.selectedValue
                this.$store.dispatch('updateIndividu', this.individu)
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
