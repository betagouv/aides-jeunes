<template>
    <div class="inline-block">
        <router-link :to="{name: routeName, params: {text: text}}" class="aj-help-popup aj-help-mobile aj-tooltip a-unstyled" exact>
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
            },
            routeName: {
                type: String,
                default: 'en_savoir_plus'
            }
        },
        data() {
            return {
                open: false
            }
        },
        methods: {
            enSavoirPlusEvent() {
                this.$matomo && this.$matomo.trackEvent('General', 'En savoir plus', this.$route.path)
            }
        }
    }
</script>
