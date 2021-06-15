<template>
  <div class="aj-sommaire-page-container">
    <h2>Toutes les étapes</h2>
    <BackButton
      @click.native="window && window.history.back()"
      class="aj-sommaire-page-back-button"
    ></BackButton>

    <div class="aj-sommaire-content">
      <SommaireContent></SommaireContent>
    </div>
  </div>
</template>

<script>
import SommaireContent from "@/components/SommaireContent"
import BackButton from "@/components/Buttons/BackButton"

export default {
  name: "SommairePage",
  components: {
    SommaireContent,
    BackButton,
  },
  data() {
    return {
      window,
    }
  },
}
</script>

<style lang="scss">
.aj-sommaire-page-container .aj-sommaire-page-back-button {
  margin-top: 0;
  &:active,
  &:focus {
    margin-top: 0;
  }
}
</style>
