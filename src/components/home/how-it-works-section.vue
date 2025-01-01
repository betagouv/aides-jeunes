<template>
  <div class="fr-container fr-mt-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12">
        <h2 class="fr-h3 fr-mb-4w">Comment ça marche ?</h2>
        <div class="aj-home-steps">
          <div
            v-for="(step, index) in steps"
            :key="`steps-${index}`"
            class="aj-home-step"
          >
            <div class="aj-home-step__number">{{ index + 1 }}</div>
            <div>
              <h3 class="fr-text--lg">{{ step.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "Je commence une simulation",
  },
  {
    title: "Je découvre mes aides",
  },
  {
    title: "Je fais mes demandes",
  },
  {
    title: "Je suis accompagné",
  },
]
</script>
