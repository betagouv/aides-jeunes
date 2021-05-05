<template>
    <div class="aj-unbox">
        <button class="aj-etablissements-back-button button outline small with-icon" type="button" v-on:click="window && window.history.back()">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z" fill="#030F8F"/>
            </svg>
            Retour aux résultats
        </button>
        <p class="aj-etablissements-intro">
            Voici les lieux où vous pouvez y être accompagné(e) pour faire vos demandes et poser toutes vos questions.
        </p>
        <p v-show="updating"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération en cours…</p>
        <div v-if="list && list.length">
            <div v-for="(etablissement, index) in list" class="aj-etablissement-container" v-bind:key="index">
                <Etablissement v-bind:etablissement="etablissement"/>
            </div>
        </div>
        <div v-else>
            <router-link to="/simulation/resultats">
                <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Revenir aux résultats
            </router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    import Etablissement from '@/components/Etablissement'
    import EtablissementLib from '@/lib/Etablissement'

    export default {
        name: 'LieuxGeneriques',
        components: {
            Etablissement,
        },
        data: function() {
            return {
                list: [],
                updating: true,
                window
            }
        },
        mounted: function() {
            const city = this.$store.state.situation.menage.depcom
            const genericPlacesSlugs = 'cij+mission_locale'
            axios.get(`https://etablissements-publics.api.gouv.fr/v3/communes/${city}/${genericPlacesSlugs}`)
                .then(function(response) { return response.data.features }, function() { return [] })
                .then(function(etablissements) {
                    return etablissements.map(EtablissementLib.normalize)
                }).then(o => {
                this.list = o
            }).finally(() => {
                this.updating = false
            })
        }
    }
</script>
