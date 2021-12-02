<template>
  <div class="aj-sommaire-container">
    <div class="aj-sommaire-content">
      <h4>Ma simulation</h4>
      <div>
        <div class="aj-progressBar-container">
          <div class="aj-step-container">
            <div
              v-for="(chapter, index) in chapters"
              :key="index"
              class="aj-step"
            >
              <div
                class="aj-step-icon"
                :class="{
                  'aj-step-done': chapter.done,
                  'aj-step-inactive': !chapter.done,
                  'aj-step-active': chapter.current,
                }"
              >
                <img
                  src="../assets/images/done.svg"
                  class="aj-check-icon"
                  alt="Logo validé"
                />
              </div>
              <router-link
                :to="chapter.root"
                class="aj-step-title"
                :class="{
                  'aj-active-title': chapter.current,
                  'aj-disabled-title': disabledLink(chapter, index),
                }"
                :tabindex="disabledLink(chapter, index) ? -1 : 0"
              >
                {{ chapter.label }}
              </router-link>
            </div>
          </div>
          <div class="aj-progressBar"></div>
        </div>

        <div class="aj-btn-container" v-if="$store.getters.passSanityCheck">
          <router-link class="button outline" :to="{ name: 'recapitulatif' }"
            >Récapitulatif</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Summary",
  computed: {
    chapters() {
      return this.$state.chapters(
        this.$route.path,
        this.$store.getters.getAllSteps,
        this.$store.getters.lastUnansweredStep &&
          this.$store.getters.lastUnansweredStep.path
      )
    },
    isOldSituation() {
      return !this.$store.state.answers
    },
  },
  methods: {
    disabledLink(chapter, index) {
      if (this.isOldSituation) {
        return true
      }
      return index === 0
        ? false
        : !chapter.done && !this.chapters[index - 1].done
    },
  },
}
</script>

<style type="text/css"></style>
