<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <legend>
                {{ participationQuestion.label }}
                <span v-if="participationQuestion.hint" class="help">{{ participationQuestion.hint }}</span>
            </legend>
            <label v-for="response in participationQuestion.responses" v-bind:key="response.value">
                <input type="radio" name="coloc" v-model="participationQuestion.selectedValue" v-bind:value="response.value"
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
        name: 'SimulationMenageParticipationFrais',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                title: 'Mon logement',
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
        methods: {
            onSubmit: function() {
                if (this.participationQuestion.selectedValue === undefined) {
                    this.$store.dispatch('updateError', true)
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
