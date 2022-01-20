<template>
  <div>
    <p>
      Avec vos ressources, le simulateur de la CAF ne vous permet pas d'indiquer
      votre statut étudiant. Pour cette raison, le montant indiqué sur le
      simulateur de la CAF est plus approximatif que celui de notre simulateur.
    </p>
    <p>
      Si vous constatez un écart important avec le montant d'aide au logement
      que vous recevez effectivement, vous pouvez prendre contact avec nous.
      Nous pourrons essayer de comprendre l'origine de l'écart.
    </p>

    <router-link
      class="button outline text-center back-button"
      to="/simulation/resultats"
    >
      Retourner aux résultats
    </router-link>
  </div>
</template>

<script>
export default {
  name: "AideLogement",
}
</script>

<style scoped>
.back-button {
  margin-top: 16px !important;
}
</style>
