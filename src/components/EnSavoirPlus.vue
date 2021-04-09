<template>
    <div>
        <div class="aj-help-popup aj-tooltip" :data-text="text" @click="toggleModal(true)">
            <div class="aj-help-icon">i</div>
            en savoir plus
        </div>
        <div v-if="open" class="aj-help-modal">
            <span class="aj-help-modal-close">
                <svg @click="toggleModal(false)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            </span>
            <div class="aj-help-modal-content">
                {{ text }}
            </div>
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
                open: false
            }
        },
        methods: {
            toggleModal(open) {
                this.open = open
            }
        }
    }
</script>
