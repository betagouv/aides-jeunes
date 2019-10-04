<template>
  <div class="container">
    <h1>
      Résultats de votre simulation<span id="result-datetime"> du {{ situation.dateDeValeur }}</span>
    </h1>

    <p v-show="awaitingResults"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Calcul en cours de vos droits…</p>

    <div id="warning" class="alert alert-warning" v-show="warning" role="alert">
      <h2><i class="fa fa-warning" aria-hidden="true"></i> Aucun résultat disponible</h2>
      <h3 v-show="warningMessage">{{ warningMessage }}</h3>
      <p>
        Pour commencer votre simulation, rendez-vous sur la <a ui-sref="home">page d'accueil</a>.
      </p>
    </div>

    <div id="error" class="alert alert-danger" v-show="error" role="alert">
      <h2><i class="fa fa-warning" aria-hidden="true"></i> Une erreur est survenue.</h2>
      <p><a analytics-on="click" analytics-category="Contact" analytics-event="Support"
        mail-to="bug@mes-aides.gouv.fr"
        v-bind:subject="`[${situation._id}] Problème technique`"
        v-bind:body="`Bonjour,

    J'ai tenté de XXX,
    Et en cliquant sur XXX,
    J'ai rencontré l'erreur ci-dessous.

    Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

    ————
    ID : ${ situation._id }
    User-agent : ${ encodedUserAgent }
    Erreur : ${ encodedError }
    ————`">Signalez ce problème</a> en décrivant ce que vous faisiez avant que cette erreur n'apparaisse, et en joignant si possible une capture d'écran. Nous vous répondrons au plus vite et corrigerons le problème dès que possible.</p>

      <p>Pour ne pas perdre les données que vous avez déclarées, vous pouvez garder cet onglet ouvert, puis actualiser la page une fois que le problème sera résolu.</p>

      <small>
        Informations techniques :
        <pre v-html="error"></pre>
      </small>
    </div>

    <div v-show="! error && ! warning && ! awaitingResults">

      <div v-if="! (droits | isEmpty)">
        <p>
          D'après la situation que vous avez décrite, vous êtes a priori éligible à ces aides.
          <span id="print-disclaimer">Ces résultats sont fondés sur les seules informations que vous avez indiquées et ne constituent en aucune façon un engagement de la part des organismes cités.</span>
          Les montants avancés sont arrondis à une dizaine d'euros près :
        </p>
        <DroitsEligiblesList v-bind:droits="droits"></DroitsEligiblesList>
      </div>
<!-- 
      <div v-if="! (droitsNonEligibles | isEmpty)" v-show="droitsNonEligiblesShow">
        <p>
          Les conditions des aides suivantes <strong>ne sont pas</strong> remplies :
        </p>
        <droit-non-eligibles-list
          droits="droitsNonEligibles"
          filter="['cmu_c', 'acs']"></droit-non-eligibles-list>
      </div>

      <div class="frame-resultats" v-show="(droits | isEmpty) && ressourcesYearMoins2Captured">
          <h2>Votre simulation n'a pas permis de découvrir de nouveaux droits.</h2>
          <p>Si vous êtes dans une situation difficile, d'<a ui-sref="sos">autres solutions existent</a>.</p>
      </div>

      <div class="frame-resultats" v-show="ressourcesYearMoins2Captured === false">
        <h2 v-show="(droits | isEmpty)">Juste une dernière étape…</h2>
        <ym2-ressources-call-to-action></ym2-ressources-call-to-action>
      </div>

      <offline-result situation="situation" v-show="droits | isNotEmpty"></offline-result>

      <div class="print-hidden">
        <div>
          <h4>Nous améliorons ce simulateur en continu, et
            <a
              href
              analytics-on="click"
              analytics-category="Contact"
              analytics-event="Go"
              v-on:click="goToFeedback()">
              vous pouvez nous y aider</a>&nbsp;!</h4>
        </div>
      </div>

      <div class="page-break"></div>

      <h1 v-if="! (droits | isEmpty)">Comment obtenir vos aides ?</h1>
      <droit-eligibles-details
        city="situation.menage.depcom"
        droits="droits"
        patrimoine-captured="! shouldPatrimoineBeCaptured()"
        ressources-year-moins-2-captured="ressourcesYearMoins2Captured"
        year-moins-2="yearMoins2"
        ></droit-eligibles-details>

      <div class="print-hidden">
        <div id="feedback">
          <h2>Nous améliorons ce simulateur en continu, et vous pouvez nous y aider !</h2>
          <p>La plupart des résultats que nous vous proposons sont automatiquement arrondis à une dizaine d'euros près.</p>
          <ul>
            <li><a analytics-on="click" analytics-category="Contact" analytics-event="Support"
              mail-to="feedback@mes-aides.gouv.fr"
              v-bind:subject="`[${ situation._id }] Suggestion`">Vous avez une suggestion d'amélioration</a>.</li>
            <li><a analytics-on="click" analytics-category="Contact" analytics-event="Support"
              mail-to="feedback@mes-aides.gouv.fr"
              v-bind:subject="`[${ situation._id }] Montants inattendus`"
              v-bind:body="`Bonjour,

    En effectuant une simulation sur mes-aides.gouv.fr, j'ai obtenu le résultat suivant :

    - XXX € / mois pour la prestation «  ».

    Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :

    - XXX € / mois pour la prestation «  ».

    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.

    Bonne journée,

    ————
    ID : ${ situation._id } (à conserver impérativement pour traitement de votre demande)
    ————`">Ces résultats ne correspondent pas à ceux d'un autre simulateur</a>.</li>
            <li><a analytics-on="click" analytics-category="Contact" analytics-event="Support"
              mail-to="feedback@mes-aides.gouv.fr"
              v-bind:subject="`[${situation._id}] Montants inattendus`"
              v-bind:body="`Bonjour,

    En effectuant une simulation sur mes-aides.gouv.fr, j'ai obtenu le résultat suivant :

    - XXX € / mois pour la prestation «  ».

    Mais XXX a fini par m'attribuer le montant suivant :

    - XXX € / mois pour la prestation «  ».

    J'ai bien compris que vous n'étiez pas décisionnaires et ne pourrez pas intervenir en ma faveur.

    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart et améliorer le simulateur pour d'autres utilisateurs.

    Bonne journée,

    ————
    ID : ${situation._id} (à conserver impérativement pour traitement de votre demande)
    ————`">Ces résultats ne correspondent pas à ce que l'administration vous a attribué</a>.</li>
          </ul>
          <small v-if="situation._id">Cette simulation a pour identifiant <span class="preformatted">{{ situation._id }}</span> (en savoir plus sur <a ui-sref="cgu_donnees">le traitement de vos données personnelles</a>).</small><br>
          <small>
            Partenaires :
            <a
              ui-sref="foyer.resultat.suggestion"
              analytics-on="click"
              analytics-category="Test"
              analytics-event="New"
              >créez un test</a>
            ou bien
            <a
              target="_blank"
              v-bind:href="openfiscaTracerURL"
              analytics-on="click"
              analytics-category="Tracer"
              >accédez à l'outil d'analyse des résultats de cette simulation</a>.
          </small>
        </div>

        <div>
          <h4 v-show="! (droitsInjectes | isEmpty)">Vous avez indiqué ces aides au cours la simulation et elles n'ont pas été recalculées</h4>
          <droits-list droits="droitsInjectes"></droits-list>
        </div>

        <div id="social">
          <p>Suivez-nous sur <a ui-sref="social">nos réseaux sociaux</a> ! Nos messages privés sont ouverts pour vous permettre de communiquer avec nous en toute discrétion.</p>

          <p style="text-align:center;"><a href="https://www.facebook.com/MesAides"><img src="/img/social/picto_facebook.png" alt="Facebook"></a>  <a href="https://twitter.com/MesAides"><img src="/img/social/picto_twitter.png" alt="Twitter"></a></p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>

import DroitsEligiblesList from './../../components/DroitsEligiblesList'
import { computeAides } from '../../../backend/lib/mes-aides'

const response = require('../../../sample-response.json')
const situation = require('../../../sample-situation.json')

export default {
  name: 'resultat',
  data: function() {
    return {
      awaitingResults: false,
      droitsNonEligiblesShow: true,
      encodedError: 'encodedError',
      encodedUserAgent: 'encodedUserAgent',
      error: false,//'Erreur',
      openfiscaTracerURL: 'openfiscaTracerURL',
      ressourcesYearMoins2Captured: false,
      resultats: computeAides(situation, response),
      situation: situation,
      warning: false,//true,
      warningMessage: 'Attention',
    }
  },
  components: {
    DroitsEligiblesList,
  },
  computed: {
    droits: function() { return this.resultats.droitsEligibles },
    droitsNonEligibles: function() { return this.resultats.droitsNonEligibles },
    droitsInjectes: function() { return this.resultats.droitsInjectes },
  },
  methods: {
    goToFeedback: function() {
      alert('TODO')
    },
    isEmpty: (array) => array.length === 0,
    isNotEmpty: (array) => array.length !== 0
  },
}
</script>

<style scoped lang="scss">

.container, .panel {
  opacity: 1;
}

</style>
