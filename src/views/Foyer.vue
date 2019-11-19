<template>
  <div class="foyer">
    <router-view/>
    <FoyerRecap></FoyerRecap>
  </div>
</template>

<script>
import FoyerRecap from '@/components/FoyerRecap.vue'

export default {
  name: 'foyer',
  components: {
    FoyerRecap
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.foyer {
  flex-grow: 1;
  background-color: whitesmoke;
  padding: 1em;
}

pre {
  text-align: left;
}

h1[tabindex="-1"] {
  outline: none;
}
</style>
