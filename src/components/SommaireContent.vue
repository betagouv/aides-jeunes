<template>
  <div>
    <div class="aj-progressBar-container">
      <div class="aj-step-container">
        <div v-for="(chapter, index) in chapters" :key="index" class="aj-step">
          <div
            class="aj-step-icon"
            :class="{
              'aj-step-done': chapter.done,
              'aj-step-inactive': !chapter.done,
              'aj-step-active': chapter.current,
              'aj-step-inprogress': chapterInProgress(chapter, index),
            }"
          >
            <img
              src="../assets/images/done.svg"
              class="aj-check-icon"
              alt="Logo validé"
            />
          </div>
          <router-link
            :to="getRootChapterPath(chapter, index)"
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
    <div class="aj-btn-container" v-show="$route.name !== 'resultats'">
      <router-link
        to="/simulation/resultats"
        :class="{ disabled: disableResults }"
        class="button"
        >Voir les résultats</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SommaireContent",
  computed: {
    chapters() {
      return this.$state.chapters(
        this.$route.path,
        this.$store.state.situation,
        this.$store.state.userJourney
      )
    },
    disableResults() {
      return this.chapters.filter((c) => c.done).length !== this.chapters.length
    },
  },
  methods: {
    getRootChapterPath(chapter, index) {
      if (this.chapterInProgress(chapter, index)) {
        return this.$state.max(
          this.$store.state.situation,
          this.$store.state.userJourney
        ).path
      } else {
        return this.$state.chapterRoot(
          chapter.name,
          this.$store.state.situation
        ).path
      }
    },
    disabledLink(chapter, index) {
      return index === 0
        ? false
        : !chapter.done && !this.chapters[index - 1].done
    },
    chapterInProgress(chapter, index) {
      return !chapter.current && !chapter.done && this.chapters[index - 1].done
    },
  },
}
</script>

<style type="text/css"></style>
