<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label v-for="logementType in logementTypesQuestion.responses" v-bind:key="logementType.value">
                <input type="radio" name="logementType" v-model="logementTypesQuestion.selectedValue" v-bind:value="logementType.value"
                />
                {{ logementType.label | capitalize }}
                <span v-if="logementType.hint" class="help">({{ logementType.hint }})</span>
            </label>
        </fieldset>

        <fieldset v-if="logementTypesQuestion.selectedValue == 'proprietaire'">
            <label>{{ primoAccedantQuestion.label }}<span v-if="primoAccedantQuestion.hint" class="help">({{ primoAccedantQuestion.hint }})</span></label>
            <label v-for="response in primoAccedantQuestion.responses" v-bind:key="response.value">
                <input type="radio" :name="response.value" v-model="primoAccedantQuestion.selectedValue" v-bind:value="response.value"
                />
                {{ response.label | capitalize }}
                <span v-if="response.hint" class="help">({{ response.hint }})</span>
            </label>
        </fieldset>

        <fieldset v-if="logementTypesQuestion.selectedValue == 'locataire'">
            <label>{{ locataireTypesQuestion.label }}<span v-if="locataireTypesQuestion.hint" class="help">({{ locataireTypesQuestion.hint }})</span></label>
            <label v-for="response in locataireTypesQuestion.responses" v-bind:key="response.value">
                <input type="radio" :name="response.value" v-model="locataireTypesQuestion.selectedValue" v-bind:value="response.value"
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
    import Logement from '@/lib/Logement'
    import _ from 'lodash'

    export default {
        name: 'SimulationLogement',
        components: {
            Actions,
        },
        data: function() {
            return {
                title: 'Votre logement principal',
                logementTypesQuestion: {
                    selectedValue: _.get(Logement.getLogementVariables(this.$store.getters.getLogementStatut), 'type', null),
                    responses: [
                        {
                            label: 'Locataire',
                            value: 'locataire',
                            hint: 'figurant sur le bail, en foyer ou en résidence'
                        },
                        {
                            label: 'Propriétaire',
                            value: 'proprietaire',
                            hint: 'ou en location-accession'
                        },
                        {
                            label: 'Hébergé',
                            value: 'heberge',
                            hint: 'chez un particulier ou en logement de fonction'
                        },
                        {
                            label: 'Sans domicile stable',
                            value: 'sansDomicile',
                            hint: 'ou domiciliation administrative'
                        }
                    ]
                },
                primoAccedantQuestion: {
                    label: 'Êtes-vous primo-accédant pour cette propriété ? Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.',
                    selectedValue: _.get(Logement.getLogementVariables(this.$store.getters.getLogementStatut), 'primoAccedant', null),
                    hint: null,
                    responses: [
                        {
                            label: 'Oui',
                            value: true,
                            hint: null
                        },
                        {
                            label: 'Non',
                            value: false,
                            hint: null
                        }
                    ]
                },
                locataireTypesQuestion: {
                    label: 'Quel type de logement louez-vous ?',
                    selectedValue: _.get(Logement.getLogementVariables(this.$store.getters.getLogementStatut), 'locationType', null),
                    hint: null,
                    responses: [
                        {
                            label: 'Non meublé',
                            value: 'nonmeuble',
                            hint: null
                        },
                        {
                            label: 'Meublé / Hôtel',
                            value: 'meublehotel',
                            hint: null
                        },
                        {
                            label: 'Foyer',
                            value: 'foyer',
                            hint: 'résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...'
                        }
                    ]
                }
            }
        },
        methods: {
            onSubmit: function() {
                this.$store.dispatch('updateMenage', {
                    statut_occupation_logement: Logement.getStatutOccupationLogement(
                        {
                            type: this.logementTypesQuestion.selectedValue,
                            primoAccedant: this.primoAccedantQuestion.selectedValue,
                            locationType: this.locataireTypesQuestion.selectedValue
                        }
                    )
                })
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
