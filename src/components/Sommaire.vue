<template>
    <div class="aj-sommaire-container">
        <div class="aj-sommaire-content">
            <h1>Ma simulation</h1>
            <div class="aj-progressBar-container">
                <div class="aj-step-container">
                    <div v-for="(chapter,index) in chapters" :key="index" class="aj-step">
                        <div class="aj-step-icon" :class="{'aj-step-done': chapter.done, 'aj-step-inactive': !chapter.done, 'aj-step-active' : chapter.current}">
                            <img v-if="chapter.done" src="../assets/images/done.svg" class="aj-check-icon">
                        </div>
                        <router-link :to="chapter.root" class="aj-step-title" :class="{'aj-active-title' : chapter.current, 'aj-disabled-title' : disabledLink(chapter, index)}">
                            {{ chapter.label }}
                        </router-link>
                    </div>
                </div>
                <div class="aj-progressBar"></div>
            </div>
            <div class="aj-btn-container">
                <router-link to="/simulation/resultats" :class="{'disabled': disableResults}" class="button">Voir les résultats</router-link>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Sommaire',
    computed: {
        chapters() {
            return this.$state.chapters(this.$route.path, this.$store.getters.getFullSteps)
        },
        disableResults() {
            return this.chapters.filter(c => c.done).length !== this.chapters.length
        }
    },
    methods: {
        disabledLink(chapter, index) {
            return index === 0 ? false : !chapter.done && !this.chapters[index - 1].done
        }
    }
}
</script>

<style type="text/css">
</style>
