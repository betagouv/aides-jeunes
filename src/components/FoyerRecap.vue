<template>
  <div class="container">
    <!-- <pre>{{JSON.stringify(situation, null, 2)}}</pre> -->
  </div>
</template>

<script>
export default {
  name: "FoyerRecap",
  computed: {
    situation: function () {
      return this.$store.state.situation
    },
  },
}
</script>
