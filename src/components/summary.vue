<template>
  <nav
    class="fr-sidemenu fr-sidemenu--sticky-full-height fr-col-lg-12"
    aria-label="Sommaire"
  >
    <div class="fr-sidemenu__inner">
      <button
        class="fr-sidemenu__btn"
        hidden
        aria-controls="fr-sidemenu-wrapper"
        aria-expanded="false"
      >Sommaire</button>
      <div
        class="fr-collapse"
        id="fr-sidemenu-wrapper"
      >
        <div class="fr-sidemenu__title fr-text--regular fr-pt-5w">Ma simulation</div>
        <ul class="fr-sidemenu__list">
          <li
            v-for="(chapter, index) in chapters"
            :key="index"
            class="fr-sidemenu__item"
            :class="{
              'aj-step-done': chapter.done,
              'fr-sidemenu__item--active': !chapter.done,
              'aj-step-active': chapter.current,
            }"
          >
            <router-link
              :to="chapter.root"
              :tabindex="disabledLink(chapter, index) ? -1 : 0"
              class="fr-sidemenu__link"
              :class="{
                'aj-active-title': chapter.current,
                'aj-disabled-title': disabledLink(chapter, index),
              }"
              target="_self"
            >{{ chapter.label }}</router-link>
          </li>
        </ul>
      </div>
      <div>
        <ul
          v-if="store.passSanityCheck"
          class="fr-btns-group fr-btns-group--inline fr-mt-5w"
        >
          <li v-if="!isRecapitulatif">
            <router-link
              class="fr-btn fr-btn--secondary"
              :to="{ name: 'recapitulatif' }"
            >{{
                isResultsPage ? "Modifier ma simulation" : "Récapitulatif"
              }}</router-link>
          </li>
          <li v-else>
            <BackButton @click="goBack()">Retour</BackButton>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores"

export default {
  name: "Summary",
  components: { BackButton },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    chapters() {
      return this.$state.chapters(
        this.$route.path,
        this.store.getAllSteps,
        this.store.lastUnansweredStep?.path
      )
    },
    isRecapitulatif() {
      return this.$route.name === "recapitulatif"
    },
    isResultsPage() {
      return (
        this.$route.name === "resultats" ||
        this.$route.name === "resultatsDetails"
      )
    },
  },
  methods: {
    disabledLink(chapter, index) {
      return index === 0
        ? false
        : !chapter.done && !this.chapters[index - 1].done
    },
    goBack() {
      window?.history.back()
    },
  },
}
</script>

<style type="text/css"></style>
