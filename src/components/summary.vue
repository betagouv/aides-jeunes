<template>
  <nav class="fr-sidemenu fr-col-lg-12" aria-label="Sommaire" role="navigation">
    <div class="fr-sidemenu__inner aj-fr-sidemenu__inner">
      <button
        ref="sideMenuButton"
        class="fr-sidemenu__btn fr-px-2w"
        aria-controls="fr-sidemenu-wrapper"
        aria-expanded="false"
        >Sommaire</button
      >
      <div id="fr-sidemenu-wrapper" class="fr-collapse">
        <h2
          class="fr-sidemenu__title fr-text--regular fr-hidden fr-unhidden-md fr-pt-5w fr-px-2w"
          >Ma simulation</h2
        >
        <ul class="fr-sidemenu__list">
          <li
            v-for="(chapter, index) in chapters"
            :key="index"
            class="fr-sidemenu__item"
          >
            <router-link
              v-if="!disabledLink(chapter, index)"
              :to="chapter.root"
              tabindex="0"
              class="fr-sidemenu__link fr-px-2w"
              :aria-current="isChapterCurrent(chapter) ? true : null"
              @click="mobileNavigationCollapse()"
              >{{ chapter.label }}</router-link
            >
            <span v-else class="fr-sidemenu__link fr-text--disabled fr-px-2w">{{
              chapter.label
            }}</span>
          </li>
        </ul>
        <div>
          <ul
            v-if="store.passSanityCheck"
            class="fr-btns-group fr-btns-group--inline-md fr-mt-5w fr-px-2w fr-px-md-0"
          >
            <li v-if="!isRecapitulatif">
              <router-link
                class="fr-btn fr-btn--secondary"
                :to="{ name: 'recapitulatif' }"
                data-testid="previous-or-recap-button"
                @click="mobileNavigationCollapse()"
                >{{
                  isResultsPage ? "Modifier ma simulation" : "Récapitulatif"
                }}</router-link
              >
            </li>
            <li v-else>
              <BackButton @click="goBack()">Retour</BackButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores/index.ts"
import { ChapterState } from "@lib/enums/chapter"

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
        : !this.isChapterDone(chapter) &&
            !this.isChapterDone(this.chapters[index - 1])
    },
    goBack() {
      this.mobileNavigationCollapse()
      window?.history.back()
    },
    mobileNavigationCollapse() {
      this.$refs.sideMenuButton.setAttribute("aria-expanded", false)
    },
    isChapterCurrent(chapter) {
      return chapter.state === ChapterState.current
    },
    isChapterDone(chapter) {
      return chapter.state === ChapterState.done
    },
  },
}
</script>
