<template>
  <div class="fr-container fr-px-0 fr-mb-0">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-12 fr-col-lg-7">
        <h2 class="fr-text--lead">Trouver de l'aide près de chez moi ?</h2>
        <p
          >Pour vous aider dans vos démarches, n'hésitez pas à consulter la
          liste des lieux où vous pourrez être accompagné.</p
        >
      </div>
      <div class="fr-col-12 fr-col-lg-5">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--center"
        >
          <li>
            <router-link
              :to="{
                name: 'resultatsLieuxGeneriques',
              }"
              class="fr-btn fr-icon-map-pin-2-line fr-btn--icon-right fr-btn--icon-center fr-px-3v fr-btn--multiline"
              data-testid="nearby-help"
            >
              Trouver de l'aide
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TrouverInterlocuteur",
}
</script>
