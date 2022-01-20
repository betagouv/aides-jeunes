<template>
  <div>
    <p v-if="isProprietaireAvecPretEnCours || isHebergeParticipeFrais">
      Vous avez indiqué être
      <strong v-if="isProprietaireAvecPretEnCours"
        >toujours en train de rembourser le crédit pour votre logement
        principal.</strong
      >
      <strong v-else-if="isHebergeParticipeFrais"
        >hébergé·e en participant aux frais du logement.</strong
      >
    </p>

    <div>
      Sur le simulateur de
      <a
        href="http://www.caf.fr/allocataires/mes-services-en-ligne/estimer-vos-droits/simulation-prime-d-activite"
        >caf.fr</a
      >, la question suivante est posée :

      <blockquote>
        <i
          >Vous (ou votre conjoint·e) êtes propriétaire de votre logement
          principal ou êtes logé·e·s gratuitement ?</i
        >
      </blockquote>

      Dans votre situation, vous devez répondre :
      <ul>
        <li>
          « Non » si vous êtes bien
          <strong v-if="isProprietaireAvecPretEnCours"
            >en train de rembourser le crédit pour votre logement
            principal.</strong
          >
          <strong v-else-if="isHebergeParticipeFrais"
            >hébergé·e en participant aux frais du logement.</strong
          >
        </li>
        <li>
          « Oui » uniquement si
          <span v-if="isProprietaireAvecPretEnCours"
            >vous n’avez
            <strong>pas de prêt pour votre habitation principale.</strong></span
          >
          <span v-else-if="isHebergeParticipeFrais"
            >vous
            <strong>ne participez pas aux frais du logement.</strong></span
          >
        </li>
      </ul>
    </div>

    <div>
      <p>Vous pouvez à présent :</p>
      <ul>
        <li>
          Retourner à la
          <router-link to="/simulation/logement">
            page « Logement »
          </router-link>
          pour modifier ces informations
        </li>
        <li>
          Faire une
          <a
            href="http://www.caf.fr/allocataires/mes-services-en-ligne/estimer-vos-droits/simulation-prime-d-activite"
            target="_blank"
            >nouvelle simulation sur caf.fr</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultatInattenduPpa",
  computed: {
    isProprietaireAvecPretEnCours: function () {
      return this.$store.getters.isProprietaireAvecPretEnCours
    },
    isHebergeParticipeFrais: function () {
      return this.$store.getters.isHebergeParticipeFrais
    },
    situation: function () {
      return this.$store.getters.situation
    },
  },
}
</script>
