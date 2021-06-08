<template>
  <div class="aj-sommaire-page-container">
    <h2>Sommaire</h2>
    <BackButton @click.native="window && window.history.back()"></BackButton>

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

<style scoped></style>
