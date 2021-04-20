<template>
    <div class="inline-block">
        <router-link :to="{name: 'en_savoir_plus', params: {element: routeElement}}" :data-text="hint" class="aj-help-popup aj-tooltip a-unstyled" @mouseover="enSavoirPlusEvent()" exact>
            <div class="aj-help-icon">i</div>
            en savoir plus
        </router-link>
    </div>
</template>

<script>
    import Hint from '@/lib/Hint'

    export default {
        name: 'EnSavoirPlus',
        data() {
          return {
              hint: Hint.handicap(),
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
