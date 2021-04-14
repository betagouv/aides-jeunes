<template>
    <div class="inline-block">
        <router-link :to="{name: 'en_savoir_plus', params: {element: routeElement, text: text}}" class="aj-help-popup aj-help-mobile aj-tooltip a-unstyled" exact>
            <div class="aj-help-icon">i</div>
            en savoir plus
        </router-link>
        <div class="aj-help-popup aj-tooltip aj-help-desktop" :data-text="text" @mouseover="enSavoirPlusEvent()">
            <div class="aj-help-icon">i</div>
            en savoir plus
        </div>
    </div>
</template>

<script>
    export default {
        name: 'EnSavoirPlus',
        props: {
            text: {
                type: String,
                default: '...'
            }
        },
        data() {
            return {
                routeElement: this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1)
            }
        },
        methods: {
            enSavoirPlusEvent() {
                this.$matomo && this.$matomo.trackEvent('General', 'En savoir plus', this.$route.path)
            }
        }
    }
</script>
