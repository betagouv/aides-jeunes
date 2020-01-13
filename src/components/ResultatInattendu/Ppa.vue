<template>
  <div>
    <p>
      Vous avez indiqué être
      <strong v-if="isProprietaireAvecPretEnCours">toujours en train de rembourser le crédit pour votre logement principal.</strong>
      <strong v-else-if="isHebergeParticipeFrais">hébergé·e en participant aux frais du logement.</strong>
    </p>

    <div>
      Sur le simulateur de
      <a href="http://www.caf.fr/allocataires/mes-services-en-ligne/estimer-vos-droits/simulation-prime-d-activite">caf.fr</a>, la question suivante est posée :

      <blockquote><i>Vous (ou votre conjoint·e) êtes propriétaire de votre logement principal ou êtes logé·e·s gratuitement ?</i></blockquote>

      Dans votre situation, vous devez répondre :
      <ul>
        <li>« Non » si vous êtes bien
          <strong v-if="isProprietaireAvecPretEnCours">en train de rembourser le crédit pour votre logement principal.</strong>
          <strong v-else-if="isHebergeParticipeFrais">hébergé·e en participant aux frais du logement.</strong>
        </li>
        <li>« Oui » uniquement si
          <span v-if="isProprietaireAvecPretEnCours">vous n’avez <strong>pas de prêt pour votre habitation principale.</strong></span>
          <span v-else-if="isHebergeParticipeFrais">vous <strong>ne participez pas aux frais du logement.</strong></span>
        </li>
      </ul>
    </div>

    <p>
      Vous pouvez à présent :
      <ul>
        <li>Retourner à la <router-link to="/foyer/logement">page « Logement »</router-link> pour modifier ces informations</li>
        <li>Faire une <router-link to="http://www.caf.fr/allocataires/mes-services-en-ligne/estimer-vos-droits/simulation-prime-d-activite" target="_blank">nouvelle simulation sur caf.fr</router-link></li>
        <li>Nous contacter sur <a v-mail="{to: 'equipe@mes-aides.org', subject: emailSubject, body: emailBody}">equipe@mes-aides.org</a>, en précisant votre numéro de simulation : <strong>{{ situation._id }}</strong></li>
      </ul>
    </p>
  </div>
</template>

<script>
import * as droitsDescription from '@/../app/js/constants/benefits'

export default {
  name: 'ResultatInattenduPpa',
  data: function() {
    return {
      droit: Object.assign({id: 'ppa'}, droitsDescription.prestationsNationales.caf.prestations.ppa)
    }
  },
  computed: {
    isProprietaireAvecPretEnCours: function() { return this.$store.getters.isProprietaireAvecPretEnCours },
    isHebergeParticipeFrais: function() { return this.$store.getters.isHebergeParticipeFrais },
    situation: function() { return this.$store.state.situation },
    emailSubject: function() { return `[${this.situation._id}] Montants inattendus` },
    emailBody: function() { return `
Bonjour,

En effectuant une simulation sur mes-aides.gouv.fr, j'ai obtenu le résultat suivant :

- ${this.montant} € / mois pour la prestation «  ».

Mais en effectuant la même simulation sur le site caf.fr j'obtiens le résultat suivant / la CAF a fini par m'attribuer le montant suivant :

- XXX € / mois pour la prestation « Prime d'activité ».

Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.

Bonne journée,

————
ID : ${this.situation._id} (à conserver impérativement pour traitement de votre demande)
————
isProprietaireAvecPretEnCours: ${this.$store.getters.isProprietaireAvecPretEnCours}
isHebergeParticipeFrais: ${this.$store.getters.isHebergeParticipeFrais}
`
    }
  }
}

</script>
