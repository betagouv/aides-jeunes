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
                return this.getTitleByRoute(this.$route)
            }
        },
        methods: {
            getTitleByRoute(route) {
                const step = this.$state.current(route.path, this.$store.state.situation)
                const chapterName = step && step.chapter || ''
                return Chapters.getLabel(chapterName)
            }
        }
    }
</script>

<style type="text/css">
</style>
