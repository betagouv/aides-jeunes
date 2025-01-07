<template>
  <div class="fr-background-alt--grey fr-py-4w fr-mt-4w">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div
          v-for="(feature, index) in features"
          :key="`feature-${index}`"
          class="fr-col-12 fr-col-md-4"
        >
          <div class="fr-card fr-card--no-border">
            <div class="fr-card__body">
              <div class="fr-card__content">
                <div class="fr-card__title">
                  <span
                    :class="['fr-icon-' + feature.icon, 'fr-icon--lg']"
                    aria-hidden="true"
                  ></span>
                  {{ feature.title }}
                </div>
                <p class="fr-card__desc" v-html="feature.description"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: "timer-line",
    title: "Rapide",
    description: "Obtenez une estimation en <b>moins de 5 minutes</b>",
  },
  {
    icon: "money-euro-circle-line",
    title: "Service public gratuit",
    description:
      "<b>Public et gratuit</b> : vos données personnelles sont protégées et ne sont jamais utilisées à des fins commerciales, conformément à notre <a href='/confidentialite'>politique de confidentialité</a>.",
  },
  {
    icon: "team-line",
    title: "Complet",
    description:
      "Informations à jour et vérifiées quotidiennement par <a href='https://beta.gouv.fr/startups/aides.jeunes.html#equipe'>notre équipe</a>",
  },
]
</script>
