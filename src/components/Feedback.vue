<template>
  <div id="feedback">
    <h2>
      Nous améliorons ce simulateur en continu, et vous pouvez nous y aider&nbsp;!
    </h2>
    <p>
      La plupart des résultats que nous vous proposons sont automatiquement
      arrondis à une dizaine d'euros près.
    </p>
    <ul>
      <li>
        <a
          v-analytics="{
            name: 'Suggestion',
            action: 'Support',
            category: 'General',
          }"
          v-mail="{
            subject: `[${resultatsId}] Suggestion`,
          }"
          >Vous avez une suggestion d'amélioration</a
        >.
      </li>
      <li>
        <a
          v-analytics="{
            name: 'Écart simulation',
            action: 'Support',
            category: 'General',
          }"
          v-mail="{
            subject: `[${resultatsId}] Montants inattendus`,
            body: `Bonjour,
En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
- XXX € / mois pour la prestation «  ».
Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :
- XXX € / mois pour la prestation «  ».
Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.
Bonne journée,
————
ID : ${resultatsId} (à conserver impérativement pour traitement de votre demande)
————`,
          }"
          >Ces résultats ne correspondent pas à ceux d'un autre simulateur</a
        >.
      </li>
      <li>
        <a
          v-analytics="{
            name: 'Écart instruction',
            action: 'Support',
            category: 'General',
          }"
          v-mail="{
            subject: `[${resultatsId}] Montants inattendus`,
            body: `Bonjour,
En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
- XXX € / mois pour la prestation «  ».
Mais XXX a fini par m'attribuer le montant suivant :
- XXX € / mois pour la prestation «  ».
J'ai bien compris que vous n'étiez pas décisionnaires et ne pourrez pas intervenir en ma faveur.
Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart et améliorer le simulateur pour d'autres utilisateurs.
Bonne journée,
————
ID : ${resultatsId} (à conserver impérativement pour traitement de votre demande)
————`,
          }"
          >Ces résultats ne correspondent pas à ce que l'administration vous a
          attribué</a
        >.
      </li>
    </ul>
    <small v-if="resultatsId"
      >Cette simulation a pour identifiant
      <span class="preformatted">{{ resultatsId }}</span> (en savoir plus sur
      <router-link to="/cgu#donnees"
        >le traitement de vos données personnelles</router-link
      >).</small
    ><br />
    <small>
      <button v-if="!showExpertLinks" @click="toggleLinks">Partenaires</button>
      <div v-if="showExpertLinks">
        Partenaires&nbsp;:
        <ul>
          <li>
            <router-link to="/foyer/resultat/attendu"
              >Indiquez les résultats attendus pour cette situation</router-link
            >
          </li>
          <li>
            <a
              v-if="openfiscaTracerURL"
              v-analytics="{ category: 'Tracer' }"
              target="_blank"
              :href="openfiscaTracerURL"
              >Accédez à l'outil d'analyse des résultats de cette simulation</a
            >
          </li>
          <li>
            <a
              v-if="openfiscaAxeURL"
              v-analytics="{ category: 'Axe' }"
              target="_blank"
              :href="openfiscaAxeURL"
              >Analysez l'évolution des aides en fonction des ressources
            </a>
          </li>
        </ul>
      </div>
    </small>
  </div>
</template>
<script>
export default {
    name: 'Feedback',
    props: {
        resultatsId: String
    },
    data: function() {
        return {
            openfiscaTracerURL: false,
            openfiscaAxeURL: false,
            showExpertLinks: false,
        }
    },
    methods: {
        toggleLinks: function() {
            if (! this.openfiscaTracerURL) {
                this.$store.getters.fetchRepresentation('openfisca_tracer')
                .then(representation => {
                    this.openfiscaTracerURL = representation.destination.url
                })

                this.$store.getters.fetchRepresentation('openfisca_axe')
                .then(representation => {
                    this.openfiscaAxeURL = representation.destination.url
                })
            }
            this.showExpertLinks = ! this.showExpertLinks
        },
    }
}
</script>
