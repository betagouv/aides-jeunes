<template>
    <form @submit.prevent='onSubmit'>
        <fieldset>
            <legend><h2 class="aj-question">{{ colocQuestion.label }}</h2></legend>
            <div v-for="response in colocQuestion.responses" class="aj-selection-wrapper" v-bind:key="response.value">
                <input :id="response.label" type="radio" name="coloc" v-model="colocQuestion.selectedValue" v-bind:value="response.value"
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
        name: 'SimulationMenageColoc',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
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
        mixins: [autoSubmitMixin('colocQuestion.selectedValue')],
        methods: {
            onSubmit: function() {
                if (this.colocQuestion.selectedValue === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.coloc = this.colocQuestion.selectedValue
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
