<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label>
                {{ chambreQuestion.label }}
                <span v-if="chambreQuestion.hint" class="help">({{ chambreQuestion.hint }})</span>
            </label>
            <label v-for="response in chambreQuestion.responses" v-bind:key="response.value">
                <input type="radio" name="coloc" v-model="chambreQuestion.selectedValue" v-bind:value="response.value"
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
        name: 'SimulationMenageLogementChambre',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                title: 'Votre logement principal',
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
        methods: {
            onSubmit: function() {
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
    }

    fieldset {
        margin-bottom: 2em;
    }
</style>
