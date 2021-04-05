<template>
    <div class="aj-category-title-wrapper">
        <h1>{{ title }}</h1>
    </div>
</template>

<script>

    export default {
        name: 'TitreChapitre',
        data() {
            return {
                chapter: this.getChapterFromRoute(this.$route)
            }
        },
        computed: {
            title() {
                return this.getTitleByChapter(this.chapter)
            }
        },
        watch:{
            $route (to){
                this.chapter = this.getChapterFromRoute(to)
            }
        },
        methods: {
            getChapterFromRoute(route) {
                const step = this.$state.current(route, this.$store.state.situation)
                return step && step.chapter || ''
            },
            getTitleByChapter(chapter) {
                switch (chapter) {
                    case 'profil':
                        return 'Mon profil';
                    case 'foyer':
                        return 'Mon foyer';
                    case 'revenus':
                        return 'Mes revenus';
                    case 'logement':
                        return 'Mon logement';
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
