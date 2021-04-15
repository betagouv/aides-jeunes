<template>
    <div class="aj-wizard-container">
        <h1>Ma simulation</h1>
        <div class="aj-progressBar-container">
            <div class="aj-step-container">
                <div v-for="(chapter,index) in chapters" :key="index" class="aj-step">
                    <div class="aj-step-icon" :class="{'aj-step-done': chapter.done, 'aj-step-inactive': !chapter.done, 'aj-step-active' : index === currentStep}">
                        <img v-if="chapter.done" src="../assets/images/done.svg" class="aj-check-icon">
                    </div>
                    <router-link :to="getRootChapterPath(chapter.value)" class="aj-step-title" :class="{'aj-active-title' : index === currentStep, 'aj-disabled-title' : disabledLink(chapter, index)}">
                        {{ chapter.title }}
                    </router-link>
                </div>
            </div>
            <div class="aj-progressBar"></div>
        </div>
        <div class="aj-btn-container">
            <button :disabled="currentStep < (chapters.length + 1)" class="button">Voir les résultats</button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Wizard',
    data() {
        return {
            chapters: [
                {id: 1, title: 'Mon profil', value: 'profil', done: false},
                {id: 2, title: 'Mon foyer', value: 'foyer', done: false},
                {id: 3, title: 'Mon logement', value: 'logement', done: false},
                {id: 4, title: 'Mes revenus', value: 'revenus', done: false},
            ]
        }
    },
    computed: {
        currentStep() {
            return this.getStepByRoute(this.$route)
        }
    },
    methods: {
        setDoneChapters(step) {
          const currentChapter = this.chapters.find(c => c.value === step.chapter)
          this.chapters = this.chapters.map((c) => {
              c.done = c.id < currentChapter.id
              return c
          })
        },
        getStepByRoute(route) {
            const step = this.$state.current(route.path, this.$store.state.situation)
            const currentChapter = step && step.chapter || ''
            this.setDoneChapters(step)
            switch (currentChapter) {
                case 'profil':
                    return 0;
                case 'foyer':
                    return 1;
                case 'logement':
                    return 2;
                case 'revenus':
                    return 3;
                default:
                    return 4;
            }
        },
        getRootChapterPath(chapter) {
            const step = this.$state.chapterRoot(chapter, this.$store.state.situation)
            return step.path
        },
        disabledLink(chapter, index) {
            return index === 0 ? false : !chapter.done && !this.chapters[index - 1].done
        }
    }
}
</script>

<style type="text/css">
</style>
