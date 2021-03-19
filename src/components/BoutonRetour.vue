<template>
    <button class="button outline with-icon aj-back-button" type="button" v-on:click="window && window.history.back()"><img src="@/assets/images/arrow-back.png"/> {{ text }}</button>
</template>

<script>

    export default {
        name: 'BoutonRetour',
        props: {
            text: {
                type: String,
                default: 'Précédent'
            }
        },
        data() {
            return {
                window
            }
        },
    }
</script>

<style type="text/css">
</style>
