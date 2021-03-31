<template>
    <form @submit.prevent='onSubmit'>
        <fieldset>
            <legend>
                <h2 class="aj-question">
                    {{ participationQuestion.label }}
                    <span v-if="participationQuestion.hint" class="help">{{ participationQuestion.hint }}</span>
                </h2>
            </legend>
            <div v-for="response in participationQuestion.responses" class="aj-selection-wrapper" v-bind:key="response.value">
                <input :id="response.label" type="radio" name="coloc" v-model="participationQuestion.selectedValue" v-bind:value="response.value"
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
        name: 'SimulationMenageParticipationFrais',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                menage: menage,
                participationQuestion: {
                    label: 'Participez-vous aux frais du logement ?',
                    hint: 'Par exemple aux dépenses d\'électricité, de téléphone, etc.',
                    selectedValue: menage.participation_frais,
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
        mixins: [autoSubmitMixin({fields: [{name: 'participationQuestion.selectedValue'}]})],
        methods: {
            onSubmit: function() {
                if (this.participationQuestion.selectedValue === undefined) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                    return
                }
                this.menage.participation_frais = this.participationQuestion.selectedValue
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
