<template>
    <div class="aj-wizard-container">
        <h1>Ma simulation</h1>
        <div class="aj-progressBar-container">
            <div class="aj-step-container">
                <div v-for="(title,index) in titleList" :key="index" class="aj-step">
                    <div class="aj-step-icon" :class="[title.id < getCurrentStep ? 'aj-step-done' : 'aj-step-inactive', title.id === getCurrentStep ? 'aj-step-active' : '']">
                        <img v-if="title.id < getCurrentStep" src="../assets/images/done.svg" class="aj-check-icon">
                    </div>
                    <a class="aj-step-title" :class="{'aj-active-title' : title.id === getCurrentStep, 'aj-disabled-title' : title.id > getCurrentStep }" @click="redirectToStep(title.id)"> {{ title.title }}</a>
                </div>
            </div>
            <div class="aj-progressBar"></div>
        </div>
        <div class="aj-btn-container">
            <button class="aj-gray-btn button">Voir les résultats</button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Wizard',
    data() {
        return {
            titleList: [
                {id: 1, title: 'Mon profil'},
                {id: 2, title: 'Mon Foyer'},
                {id: 3, title: 'Mon logement'},
                {id: 4, title: 'Mes revenus'}
            ],
            currentStep: 1,
        }
    },
    computed: {
        getCurrentStep() {
            return this.getStepByRoute(this.$route)
        }
    },
    methods: {
        getStepByRoute(route) {
            const step = this.$state.current(route.path, this.$store.state.situation)
            const chapter = step && step.chapter || ''
            switch (chapter) {
                case 'profil':
                    return this.currentStep = 1;
                case 'foyer':
                    return this.currentStep = 2;
                case 'logement':
                    return this.currentStep = 3;
                case 'revenus':
                    return this.currentStep = 4;
                default:
                    return this.currentStep = 5;
            }
        },
        redirectToStep(id) {
            if(id === 1) {
                this.$router.push('/simulation/individu/demandeur/date_naissance')
            }
            if(id === 2) {
                this.$router.push('/simulation/enfants')
            }
            if(id === 3) {
                this.$router.push('/simulation/logement')
            }
            if(id === 4) {
                this.$router.push('/simulation/individu/demandeur/ressources/types')
            }
        }
    }
}
</script>

<style type="text/css">
</style>
