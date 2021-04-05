<template>
    <div class="aj-category-title-wrapper">
        <h1>{{ title }}</h1>
    </div>
</template>

<script>

    export default {
        name: 'TitreChapitre',
        data() {
            return {}
        },
        computed: {
            title() {
                return this.getTitleByUrl(this.$route.params.chapter)
            }
        },
        methods: {
            getTitleByUrl(chapter) {
                switch (chapter) {
                    case 'profil':
                        return 'Mon profil';
                    case 'foyer':
                        return 'Mon foyer';
                    case 'revenus':
                        return 'Mon revenu';
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
