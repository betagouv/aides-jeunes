<template>
    <div class="inline-block">
        <router-link :to="{path: $route.path + '/en_savoir_plus'}" :data-text="hint" class="aj-help-popup aj-tooltip a-unstyled" @mouseover="enSavoirPlusEvent()">
            <div class="aj-help-icon">i</div>
            en savoir plus
        </router-link>
    </div>
</template>

<script>
    import Hint from '@/lib/Hint'

    export default {
        name: 'EnSavoirPlus',
        computed: {
            attribute() {
                return this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1)
            },
            hint() {
                return this.attribute && Hint[this.attribute] && Hint[this.attribute]()
            }
        },
        methods: {
            enSavoirPlusEvent() {
                this.$matomo && this.$matomo.trackEvent('Parcours', 'En savoir plus hover', this.$route.path)
            }
        }
    }
</script>
