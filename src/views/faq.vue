<script setup lang="ts">
import { ref } from "vue"

const questionsAnswers = ref([
  {
    question: "Je n'habite pas en France, puis-je faire une simulation ?",
    answer:
      "Bien que le simulateur soit conçu pour les personnes résidant en France, si vous avez prévu de venir vivre en France dans le futur, vous pouvez tout de même réaliser une simulation en <b>vous projetant</b> avec le code postal où vous souhaitez habiter.",
  },
  {
    question: "Puis-je sauvegarder ma simulation ?",
    answer: `<p>À tout moment de la simulation, vous avez la possibilité de cliquer sur le bouton <b>"Revenir plus tard?"</b>
       et la page associée vous permettra d'y récupérer un lien de sauvegarde.</p>
<p>À la fin de la simulation, vous pouvez également sauvegarder vos résultats en demandant à les réceptionner 
par sms ou par email avec le bouton <b>"Recevoir les résultats par email/SMS"</b>.</p>`,
  },
  {
    question: "Je suis bloqué à la question sur le RFR / RBG, comment faire ?",
    answer: `
    <p>Si vous n'avez aucun moyen de déterminter le montant de votre RFR ou le RBG de vos parents lorsque vous êtes à leur charge), 
        vous avez la possibilité de répondre 0 à ces questions. Attention, <b>certaines aides ne
      pourront pas être calculées correctement sans le montant exact</b> du RFR,
      comme par exemple l'aide de la
      <a href="/aides/bourse_criteres_sociaux" target="_blank">Bourse sur Critères Sociaux</a>
      pour les étudiants.
    </p>
      <p>Le revenu fiscal de référence (RFR) est calculé par les impôts, à partir
      des revenus que vous avez déclarés dans votre déclaration d’impôts. Il
      prend en compte l’ensemble des revenus de votre foyer fiscal, que vous
      soyez imposable ou non imposable. Toutes les informations concernant le
      RFR et comment le trouver sont <a href="https://www.service-public.fr/particuliers/vosdroits/F13216" target="_blank">disponibles ici</a>.
    </p>
    <p>Le revenu brut global est la somme de tous vos revenus déclarés après déduction des divers abattements, comme l'abattement de 10 % pour les salaires et les retraites, ou après déduction des frais réels si vous avez opté pour ce dispositif.`,
  },
  {
    question:
      "Je suis éligible à la CSS (Ex- CMU), comment en faire la demande ?",
    answer: `
    <p>
      Pour demander votre <a href="/aides/css_participation_forfaitaire" target="_blank">Complémentaire Santé Solidaire</a>, rendez-vous sur
      <a href="https://www.ameli.fr/">le site internet </a> ou l’application
      mobile Ameli pour télécharger le formulaire de demande. 
      Si vous avez un compte Ameli.fr, connectez-vous puis <a href="https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_somtc=true#idPopupWARecueilConsentement" target="_blank"> effectuez votre demande directement en ligne</a> depuis la rubrique <b>"Mes démarches > Faire une demande de complémentaire santé solidaire"</b>. 
    </p>`,
  },
])
</script>

<template>
  <div class="fr-my-6w fr-p-2w">
    <h1 class=""> Foire aux questions </h1>
    <p>
      <router-link
        to="/"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-arrow-left-line"
        >Retour à la page d'accueil du simulateur</router-link
      >
    </p>
    <div class="fr-p-1w">
      <section
        v-for="(qa, index) in questionsAnswers"
        :key="qa.question"
        class="fr-accordion"
      >
        <button
          class="fr-accordion__btn"
          aria-expanded="false"
          :aria-controls="`accordion-${index}`"
          >{{ qa.question }}</button
        >
        <div :id="`accordion-${index}`" class="fr-collapse">
          <span v-html="qa.answer"></span>
        </div>
      </section>
    </div>
  </div>
</template>