<template>
    <form @submit.prevent='onSubmit'>
        <fieldset>
            <legend>
                <h2 class="aj-question">
                    {{ chambreQuestion.label }}
                    <span v-if="chambreQuestion.hint" class="help">{{ chambreQuestion.hint }}</span>
                </h2>
            </legend>
            <div v-for="response in chambreQuestion.responses" class="aj-selection-wrapper" v-bind:key="response.value">
                <input :id="response.label" type="radio" name="coloc" v-model="chambreQuestion.selectedValue" v-bind:value="response.value"
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
    import { autoSubmitMixin } from '@/mixins/AutoSubmit'

    export default {
        name: 'SimulationMenageLogementChambre',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                menage: menage,
                chambreQuestion: {
                    label: 'Est-ce une chambre ?',
                    hint: 'Une chambre est un logement qui ne comporte qu\'une seule pièce et n\'est pas équipée d\'un WC.',
                    selectedValue: menage.logement_chambre,
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
        mixins: [autoSubmitMixin('chambreQuestion.selectedValue')],
        methods: {
            onSubmit: function() {
                if (this.chambreQuestion.selectedValue === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.logement_chambre = this.chambreQuestion.selectedValue
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
