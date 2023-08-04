<template>
  <div class="fr-container fr-px-0 fr-mb-0 fr-py-2w">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2 class="fr-text--lead">Trouver de l'aide près de chez moi</h2>
        <p
          >Pour vous aider dans vos démarches, n'hésitez pas à consulter la
          liste des lieux où vous pourrez être accompagné.</p
        >
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <router-link
              :to="{
                name: 'resultatsLieuxGeneriques',
              }"
              class="fr-btn"
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
