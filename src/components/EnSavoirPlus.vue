<template>
    <div class="inline-block">
        <router-link :to="{path: routeElement + '/en_savoir_plus', params: {element: routeElement}}" :data-text="hint" class="aj-help-popup aj-tooltip a-unstyled" @mouseover="enSavoirPlusEvent()" exact>
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
              routeElement: this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1)
          }
        },
        computed: {
            hint() {
                return Hint[this.routeElement]()
            }
        },
        methods: {
            enSavoirPlusEvent() {
                this.$matomo && this.$matomo.trackEvent('General', 'En savoir plus', this.$route.path)
            }
        }
    }
</script>
