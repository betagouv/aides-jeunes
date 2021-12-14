<template>
  <div class="aj-find-contact-box">
    <div class="aj-find-contact-box-content">
      <h2 class="aj-question">
        Trouver de l'aide près de chez moi
      </h2>
      <span>
        Pour vous aider dans vos démarches, n'hésitez pas à consulter la liste
        des lieux où vous pourrez être accompagné.
      </span>
    </div>
    <div class="aj-find-contact-box-action">
      <router-link
        :to="{
          name: 'resultatsLieuxGeneriques',
        }"
        class="button primary"
      >
        Trouver de l'aide
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrouverInterlocuteur",
}
</script>
