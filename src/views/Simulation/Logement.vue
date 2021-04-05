<template>
    <form @submit.prevent='onSubmit'>
        <fieldset>
            <legend><h2 class="aj-question">{{ logementTypesQuestion.label }}</h2></legend>
            <div v-for="logementType in logementTypesQuestion.responses" class="aj-selection-wrapper" v-bind:key="logementType.value">
                <input :id="logementType.value" type="radio" name="logementType" v-model="logementTypesQuestion.selectedValue" v-bind:value="logementType.value"
                />
                <label :for="logementType.value">
                    {{ logementType.label | capitalize }}
                    <span v-if="logementType.hint" class="help">({{ logementType.hint }})</span>
                </label>
            </div>
        </fieldset>

        <fieldset v-if="logementTypesQuestion.selectedValue == 'proprietaire'">
            <legend><h2 class="aj-question">{{ primoAccedantQuestion.label }}<span v-if="primoAccedantQuestion.hint" class="help">({{ primoAccedantQuestion.hint }})</span></h2></legend>
            <div v-for="response in primoAccedantQuestion.responses" class="aj-selection-wrapper" v-bind:key="response.value">
                <input :id="response.label" type="radio" :name="primoAccedantQuestion.label" v-model="primoAccedantQuestion.selectedValue" v-bind:value="response.value"
                />
                <label :for="response.label">
                    {{ response.label | capitalize }}
                    <span v-if="response.hint" class="help">({{ response.hint }})</span>
                </label>
            </div>
        </fieldset>

        <fieldset v-if="logementTypesQuestion.selectedValue == 'locataire'">
            <legend><h2 class="aj-question">{{ locataireTypesQuestion.label }}<span v-if="locataireTypesQuestion.hint" class="help">({{ locataireTypesQuestion.hint }})</span></h2></legend>
            <div v-for="response in locataireTypesQuestion.responses" class="aj-selection-wrapper" v-bind:key="response.value">
                <input :id="response.value" type="radio" :name="logementTypesQuestion.label" v-model="locataireTypesQuestion.selectedValue" v-bind:value="response.value"
                />
                <label :for="response.value">
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
    import Logement from '@/lib/Logement'
    import { autoSubmitMixin } from '@/mixins/AutoSubmit'

    export default {
        name: 'SimulationLogement',
        components: {
            Actions,
        },
        data: function() {
            return {
                logementTypesQuestion: {
                    label: 'Êtes-vous ?',
                    selectedValue: (Logement.getLogementVariables(this.$store.getters.getLogementStatut) || {}).type || null,
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
                    selectedValue: (Logement.getLogementVariables(this.$store.getters.getLogementStatut) || {}).primoAccedant,
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
                    selectedValue: (Logement.getLogementVariables(this.$store.getters.getLogementStatut) || {}).locationType || null,
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
                },
            }
        },
        mixins: [autoSubmitMixin()],
        methods: {
            canAutoSubmit: function() {
                const defaultOk = (['sansDomicile', 'heberge'].indexOf(this.logementTypesQuestion.selectedValue) > -1)
                const locataireOk = this.logementTypesQuestion.selectedValue == 'locataire' && this.locataireTypesQuestion.selectedValue
                const proprietaireOk = this.logementTypesQuestion.selectedValue == 'proprietaire' && this.primoAccedantQuestion.selectedValue !== null

                return defaultOk || locataireOk || proprietaireOk
            },
            onSubmit: function() {
                if (!this.logementTypesQuestion.selectedValue) {
                    this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
                } else if (this.logementTypesQuestion.selectedValue === 'proprietaire' && this.primoAccedantQuestion.selectedValue === null) {
                    this.$store.dispatch('updateError', 'Le champ primo-accédant est obligatoire.')
                } else if (this.logementTypesQuestion.selectedValue === 'locataire' && !this.locataireTypesQuestion.selectedValue) {
                    this.$store.dispatch('updateError', 'Le champ type de logement est obligatoire.')
                } else {
                    this.$store.dispatch('updateMenage', {
                        ...this.$store.getters.getMenage,
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
        },
        watch: {
            'logementTypesQuestion.selectedValue': function() {
                this.autoSubmit()
            },
            'locataireTypesQuestion.selectedValue': function() {
                this.autoSubmit()
            },
            'primoAccedantQuestion.selectedValue': function() {
                this.autoSubmit()
            },
        }
    }
</script>

<style scoped lang="scss">
    span.help {
        font-style: italic;
        font-size: 0.8em;
        margin-left: 0.5rem;
    }

    fieldset {
        margin-bottom: 2em;
    }
</style>
