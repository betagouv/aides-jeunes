<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label>
                {{ proprietaireProcheQuestion.label }}
                <span v-if="proprietaireProcheQuestion.hint" class="help">({{ proprietaireProcheQuestion.hint }})</span>
            </label>
            <label v-for="response in proprietaireProcheQuestion.responses" v-bind:key="response.value">
                <input type="radio" name="coloc" v-model="proprietaireProcheQuestion.selectedValue" v-bind:value="response.value"
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
            const famille = this.$store.getters.getFamille || {}
            return {
                title: 'Votre logement principal',
                famille: famille,
                proprietaireProcheQuestion: {
                    label: 'Avez-vous un lien de parenté direct avec votre propriétaire ?',
                    hint: ' Est-il un ascendant ou descendant de vous ou votre conjoint·e (enfant, grand-parent…) ?',
                    selectedValue: famille.proprietaire_proche_famille,
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
                this.famille.proprietaire_proche_famille = this.proprietaireProcheQuestion.selectedValue
                this.$store.dispatch('updateFamille', this.famille)
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
