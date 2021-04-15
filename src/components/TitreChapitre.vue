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
                return this.getTitleByRoute(this.$route)
            }
        },
        methods: {
            getTitleByRoute(route) {
                const path = route.path
                const current = path.match(/en_savoir_plus/) ? path.split('/').slice(0, -1).join('/') : path
                const step = this.$state.current(current, this.$store.state.situation)
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
