<template>
    <form @submit.prevent='onSubmit'>
        <h1>{{ title }}</h1>
        <fieldset>
            <label>{{ cpQuestion.label }}</label>
            <input type="number" v-model="cpQuestion.selectedValue">
        </fieldset>
        <p v-if="retrievingCommunes"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        <fieldset v-show="communes && communes.length">
            <label>{{ communeQuestion.label }}</label>
            <select
                v-model="communeQuestion.selectedValue"
                id="commune">
                <option v-for="commune in communes" v-bind:value="commune.nom" v-bind:key="commune.code">
                    {{ commune.nom }}
                </option>
            </select>
        </fieldset>
        <Actions v-bind:onSubmit='onSubmit'/>
    </form >
</template>

<script>
    import Actions from '@/components/Actions'
    import Commune from '@/lib/Commune'
    import _ from 'lodash'

    export default {
        name: 'SimulationMenageDepCom',
        components: {
            Actions
        },
        data: function() {
            const menage = this.$store.getters.getMenage || {}
            return {
                title: 'Votre logement principal',
                menage: menage,
                retrievingCommunes: false,
                cpQuestion: {
                    label: 'Code postal',
                    selectedValue: parseInt(menage.depcom)
                },
                communeQuestion: {
                    label: 'Ville',
                    selectedValue: menage._nomCommune
                }
            }
        },
        asyncComputed: {
            communes: {
                get: function() {
                    if (! this.cpQuestion.selectedValue || this.cpQuestion.selectedValue.toString().length !== 5) {
                        return []
                    }
                    this.retrievingCommunes = true
                    return Commune.get(this.cpQuestion.selectedValue)
                        .then((communes) => {
                            if (!_.includes(_.map(communes, 'nom'), this.communeQuestion.selectedValue))
                                this.communeQuestion.selectedValue = _.get(communes, '[0].nom', null)
                            return communes
                        })
                        .catch(() => {
                            return []
                        })
                        .finally(() => {
                            this.retrievingCommunes = false
                        })
                },
                default: []
            },
        },
        methods: {
            onSubmit: function() {
                this.menage.depcom = this.cpQuestion.selectedValue.toString()
                this.menage._nomCommune = this.communeQuestion.selectedValue
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
