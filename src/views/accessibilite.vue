<template>
  <article class="text container aj-text-container">
    <h1>Déclaration d'accessibilité</h1>

    <p>
      L’accessibilité est prise en compte dans la conception de ce projet mais
      nous n’avons pas encore passé d’audit de conformité.
    </p>
    <p>
      À ce jour, la navigation au clavier et la lecture d'écran est possible.
    </p>

    <h2>État de conformité</h2>

    <p>
      Le service est <strong>non conforme avec le RGAA 4.1</strong> : le site
      n'a pas encore été audité.
    </p>

    <h2>Établissement de cette déclaration d'accessibilité</h2>

    <p>Cette déclaration a été établie le 9 avril 2021.</p>

    <h2>Signaler un dysfonctionnement</h2>

    <div>
      <p>
        Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à
        un contenu ou une fonctionnalité du site, merci de nous en faire part.
      </p>
      <ul>
        <li>
          <a
            v-mail="{
              subject: 'Problème d\'accessibilité',
            }"
            >{{ contactEmail }}</a
          >
        </li>
      </ul>
    </div>

    <p>
      Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit
      de faire parvenir vos doléances ou une demande de saisine au
      <a
        href="https://formulaire.defenseurdesdroits.fr/code/afficher.php?ETAPE=accueil_2016"
        target="_blank"
        title="Défenseur des droits - Nouvelle fenêtre"
        >Défenseur des droits</a
      >.
    </p>
  </article>
</template>

<script>
import ContactEmailMixin from "@/mixins/contact-email"

export default {
  name: "Accessibilite",
  mixins: [ContactEmailMixin],
}
</script>
