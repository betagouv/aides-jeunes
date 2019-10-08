<template>
  <div class="container">
    {{situation}}
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
