<template>
  <div id="homepage">
    <div class="container">
      <div class="aj-home-hero">
        <div class="aj-home-hero-content">
          <h1>
            <span class="hightlight"
              >Évaluez vos droits à<br />plus de 20 aides
            </span>
            <br />en moins de 5 minutes.
          </h1>
          <div class="aj-home-hero-buttons-wrapper">
            <button
              v-bind:class="`button ${ctaSize} secondary`"
              v-on:click="next()"
              v-analytics="{
                action: 'Reprendre ma simulation',
                category: 'Home',
              }"
              v-if="hasExistingSituation"
            >
              Reprendre ma simulation
            </button>
            <button
              v-bind:class="`button ${ctaSize} primary`"
              v-on:click="newSituation()"
              v-analytics="{ action: ctaLabel, category: 'Home' }"
            >
              {{ ctaLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeMixin from "@/mixins/HomeMixin"

export default {
  name: "home",
  mixins: [HomeMixin],
}
</script>
