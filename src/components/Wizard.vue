<template>
    <div class="aj-wizard-container">
        <h1>Ma simulation</h1>
        <div class="aj-progressBar-container">
            <div class="aj-step-container">
                <div v-for="(title,index) in chapters" :key="index" class="aj-step">
                    <div class="aj-step-icon" :class="[title.step < currentStep ? 'aj-step-done' : 'aj-step-inactive', title.step === currentStep ? 'aj-step-active' : '']">
                        <img v-if="title.step < currentStep" src="../assets/images/done.svg" class="aj-check-icon">
                    </div>
                    <a class="aj-step-title" :class="{'aj-active-title' : title.step === currentStep, 'aj-disabled-title' : title.step > currentStep }"> {{ title.title }}</a>
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
                {step: 1, title: 'Mon profil'},
                {step: 2, title: 'Mon foyer'},
                {step: 3, title: 'Mon logement'},
                {step: 4, title: 'Mes revenus'},
            ]
        }
    },
    computed: {
        currentStep() {
            return this.getStepByRoute(this.$route)
        }
    },
    methods: {
        getStepByRoute(route) {
            const step = this.$state.current(route.path, this.$store.state.situation)
            const chapter = step && step.chapter || ''
            switch (chapter) {
                case 'profil':
                    return 1;
                case 'foyer':
                    return 2;
                case 'logement':
                    return 3;
                case 'revenus':
                    return 4;
                default:
                    return 5;
            }
        },
    }
}
</script>

<style type="text/css">
</style>
