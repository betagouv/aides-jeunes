<template>
    <div class="aj-category-title-wrapper">
        <h1>{{ title }}</h1>
    </div>
</template>

<script>

    export default {
        name: 'TitreChapitre',
        computed: {
            title() {
                return this.getTitleByRoute(this.$route, this.$store.state.situation)
            }
        },
        methods: {
            getTitleByRoute(route, situation) {
                let path = route.path

                if (route.name.includes('en_savoir_plus')) {
                    path = path.substring(0, path.lastIndexOf('/'))
                }
                const step = this.$store.getters.passSanityCheck && this.$state.current(route.path, situation)
                const chapter = step && step.chapter || ''
                switch (chapter) {
                    case 'profil':
                        return 'Mon profil';
                    case 'foyer':
                        return 'Mon foyer';
                    case 'logement':
                        return 'Mon logement';
                    case 'revenus':
                        return 'Mes revenus';
                    case 'projets':
                        return 'Mes projets';
                    case 'resultats':
                        return 'Mes résultats';
                    default:
                        return 'Ma simulation';
                }
            }
        }
    }
</script>

<style type="text/css">
</style>
