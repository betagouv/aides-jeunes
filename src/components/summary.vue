<template>
  <div class="aj-sommaire-container">
    <div class="aj-sommaire-content">
      <h3>Ma simulation</h3>
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

        <div v-if="$store.getters.passSanityCheck" class="aj-btn-container">
          <router-link
            v-if="!isRecapitulatif"
            class="button outline"
            :to="{ name: 'recapitulatif' }"
            >{{
              isResultsPage ? "Modifier ma simulation" : "Récapitulatif"
            }}</router-link
          >
          <BackButton v-else @click="goBack()">Retour</BackButton>

          <button
            v-if="showReturnUrl"
            class="button aj-return-url"
            @click="browseToReturnUrl()"
          >
            <i class="fa fa-share-square-o" aria-hidden="true"></i>
            {{ returnUrl.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackButton from "@/components/buttons/back-button"
import { redirect } from "@/lib/redirect"

export default {
  name: "Summary",
  components: { BackButton },
  computed: {
    chapters() {
      return this.$state.chapters(
        this.$route.path,
        this.$store.getters.getAllSteps,
        this.$store.getters.lastUnansweredStep?.path
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
    showReturnUrl() {
      return this.returnUrl && this.returnUrl.label && this.returnUrl.url
    },
    returnUrl() {
      return this.$store.getters.thirdPartyData?.returnUrl
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
    browseToReturnUrl() {
      redirect(this.returnUrl.url)
    },
  },
}
</script>

<style type="text/css"></style>
