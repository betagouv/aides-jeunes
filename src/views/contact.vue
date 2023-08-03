<template>
  <article class="fr-article">
    <h1>Comment nous contacter ?</h1>

    <p>
      Nous améliorons ce simulateur en continu, et vous pouvez nous y aider !
    </p>

    <p>
      Pour cela, vous pouvez nous contacter par
      <a
        v-analytics="{ action: 'Contact', category: 'Contact' }"
        v-mail="{
          subject: 'Contact',
          body: `


  # Il est inutile de nous envoyer des documents personnels (carte de mutuelle, pièce d'identité, etc.) : nous ne pouvons pas les traiter.
  # Si vous souhaitez nous signaler une erreur, nous contacter à travers les liens proposés en fin de simulation facilite le traitement de votre demande.`,
        }"
        >courriel à l'adresse suivante {{ contactEmail }}</a
      >.
    </p>
  </article>
</template>
<script>
import ContactEmailMixin from "@/mixins/contact-email.ts"

export default {
  name: "Contact",
  mixins: [ContactEmailMixin],
}
</script>
