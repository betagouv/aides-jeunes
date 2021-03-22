<template>
    <div class="aj-help-popup aj-tooltip" :data-text="text">
        <div class="aj-help-icon">i</div>
        en savoir plus
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
        }
    }
</script>
