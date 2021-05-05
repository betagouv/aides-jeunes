<template>
    <div class="aj-category-title-wrapper">
        <h1>{{ title }}</h1>
    </div>
</template>

<script>
    import Chapters from '@/lib/Chapters'

    export default {
        name: 'TitreChapitre',
        computed: {
            title() {
                return this.getTitleByRoute(this.$route, this.$store.state.situation)
            }
        },
        methods: {
            getTitleByRoute(route) {
                const path = route.path
                const current = path.replace(/\/en_savoir_plus/, '')
                const step = this.$store.getters.passSanityCheck && this.$state.current(current, this.$store.getters.getAllSteps)
                const chapterName = step && step.chapter || ''
                return Chapters.getLabel(chapterName)
            }
        }
    }
</script>

<style type="text/css">
</style>
