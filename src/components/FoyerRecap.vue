<template>
  <div class="container">
  </div>
</template>

<script>

export default {
  name: 'FoyerRecap',
  data () {
    return {
      situation: this.$SituationService.restoreLocal()
    }
  }
}
</script>
