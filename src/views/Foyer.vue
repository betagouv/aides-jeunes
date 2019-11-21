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

<style lang="scss">

.foyer {
  flex-grow: 1;
  background-color: whitesmoke;
  padding: 1em;
}

pre {
  text-align: left;
  white-space: break-spaces;
  width: 100%
}

h1[tabindex="-1"] {
  outline: none;
}

a.button:focus,
button.button:focus,
input[type="submit"]:focus,
input[type="button"]:focus {
  background: #003b80;
  background: var(--theme-secondary-darken);
}
</style>
