<template>
  <div class="container">
    <p v-show="accessStatus.fetching"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération de la situation en cours…</p>
    <p v-show="resultatStatus.updating"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Calcul en cours de vos droits…</p>

    <div class="notification warning" v-if="hasWarning">
      <div>
        <h2><i class="fa fa-warning" aria-hidden="true"></i> Aucun résultat disponible</h2>
        <h3>La simulation à laquelle vous souhaitez accéder n‘est pas accessible.</h3>
        <p>
          Pour commencer votre simulation, rendez-vous sur la <router-link to="home">page d'accueil</router-link>.
        </p>
      </div>
    </div>

    <div id="error" class="alert alert-danger" v-if="hasError"  role="alert">
      <h2><i class="fa fa-warning" aria-hidden="true"></i> Une erreur est survenue.</h2>
      <p><a
        v-analytics="{ action:'Support', category:'Contact'}"
        v-mail="{to: 'bug@mes-aides.gouv.fr', subject:`[${resultatsId}] Problème technique`, body:`Bonjour,

    J'ai tenté de XXX,
    Et en cliquant sur XXX,
    J'ai rencontré l'erreur ci-dessous.

    Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

    ————
    ID : ${ resultatsId }
    User-agent : ${ userAgent }
    Erreur : ${ error }
    ————`}">Signalez ce problème</a> en décrivant ce que vous faisiez avant que cette erreur n'apparaisse, et en joignant si possible une capture d'écran. Nous vous répondrons au plus vite et corrigerons le problème dès que possible.</p>

      <p>Pour ne pas perdre les données que vous avez déclarées, vous pouvez garder cet onglet ouvert, puis actualiser la page une fois que le problème sera résolu.</p>

      <small>
        Informations techniques :
        <pre v-html="error"></pre>
      </small>
    </div>

    <div v-show="shouldDisplayResults">

      <div v-if="! isEmpty(droits)">
        <p>
          D'après la situation que vous avez décrite, vous êtes a priori éligible à ces aides.
          <span id="print-disclaimer">Ces résultats sont fondés sur les seules informations que vous avez indiquées et ne constituent en aucune façon un engagement de la part des organismes cités.</span>
          Les montants avancés sont arrondis à une dizaine d'euros près :
        </p>
        <DroitsList v-bind:droits="droits"></DroitsList>
      </div>

      <OfflineResults v-if="!resultatStatus.updating && ! isEmpty(droits)" v-bind:id="resultatsId" />

      <div class="notification warning print-hidden" v-if="! ressourcesYearMinusTwoCaptured">
        <span>
          <h2 v-if="droits && !droits.length">Votre simulation n'a pas permis de découvrir de nouveaux droits.</h2>
          <i class="fa fa-warning text-warning" aria-hidden="true"></i>

          Nous avons supposé que vos ressources pour l’année {{ $store.state.dates.fiscalYear.label }} étaient les mêmes qu’entre {{ $store.state.dates.twelveMonthsAgo.label }} et {{ $store.state.dates.oneMonthAgo.label }}.
        </span>

        <router-link class="button-outline warning text-center" to="ressources/fiscales">Déclarez vos ressources {{ $store.state.dates.fiscalYear.label }}</router-link>
      </div>

      <div v-if="! isEmpty(droitsNonEligiblesShown)">
        <p>
          Les conditions des aides suivantes <strong>ne sont pas</strong> remplies :
        </p>
        <DroitsList ineligible v-bind:droits="droitsNonEligiblesShown"></DroitsList>
      </div>

      <div class="frame-resultats" v-show="isEmpty(droits) && ressourcesYearMinusTwoCaptured">
          <h2>Votre simulation n'a pas permis de découvrir de nouveaux droits.</h2>
          <p>Si vous êtes dans une situation difficile, d'<router-link to="/sos">autres solutions existent</router-link>.</p>
      </div>

      <div class="print-hidden">
        <div>
          <h4>Nous améliorons ce simulateur en continu, et
            <a
              href
              v-analytics="{ action:'Go', category:'Contact'}"
              v-on:click.prevent="goToFeedback($event)">
              vous pouvez nous y aider</a>&nbsp;!</h4>
        </div>
      </div>

      <div class="page-break"></div>

      <h1 v-if="! isEmpty(droits)">Comment obtenir vos aides ?</h1>
      <DroitsDetails
        v-bind:city="situation.menage.depcom"
        v-bind:droits="droits"
        v-bind:patrimoine-captured="! shouldPatrimoineBeCaptured"
        v-bind:ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured"
        ></DroitsDetails>

      <div class="injected" v-show="isNotEmpty(droitsInjectes)">
        <h1><small>Vous avez indiqué ces aides au cours la simulation et elles n'ont pas été recalculées</small></h1>

        <div v-for="droit in droitsInjectes" v-bind:key="droit.label" class="droit-detail"
          itemscope itemtype="http://schema.org/GovernmentService">

          <div class="droit-detail-heading">
            <h2 itemprop="name"><small>{{ droit.label }}</small></h2>
            <div class="dotted-line"></div>
          </div>

          <div class="droit-detail-description">
            <p>
              <span v-html="droit.description" itemprop="description"></span>
               <BenefitCtaLink
                v-bind:analytics-name="droit.label"
                v-bind:link="droit.link"
                v-bind:benefit="droit"
                type="link"
                level="'inline'"
                itemprop="termsOfService"
              />
            </p>
          </div>
        </div>
      </div>

      <div class="print-hidden">
        <div id="feedback">
          <h2>Nous améliorons ce simulateur en continu, et vous pouvez nous y aider !</h2>
          <p>La plupart des résultats que nous vous proposons sont automatiquement arrondis à une dizaine d'euros près.</p>
          <ul>
            <li><a
              v-analytics="{ name: 'Suggestion', action:'Support', category:'General'}"
              v-mail="{to: 'feedback@mes-aides.gouv.fr', subject:`[${ resultatsId }] Suggestion`}">Vous avez une suggestion d'amélioration</a>.</li>
            <li><a
              v-analytics="{ name: 'Écart simulation', action:'Support', category:'General'}"
              v-mail="{to: 'feedback@mes-aides.gouv.fr', subject:`[${ resultatsId }] Montants inattendus`, body:`Bonjour,

    En effectuant une simulation sur mes-aides.gouv.fr, j'ai obtenu le résultat suivant :

    - XXX € / mois pour la prestation «  ».

    Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :

    - XXX € / mois pour la prestation «  ».

    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.

    Bonne journée,

    ————
    ID : ${ resultatsId } (à conserver impérativement pour traitement de votre demande)
    ————`}">Ces résultats ne correspondent pas à ceux d'un autre simulateur</a>.</li>
            <li><a
              v-analytics="{ name: 'Écart instruction', action:'Support', category:'General'}"
              v-mail="{to: 'feedback@mes-aides.gouv.fr', subject:`[${resultatsId}] Montants inattendus`, body:`Bonjour,

    En effectuant une simulation sur mes-aides.gouv.fr, j'ai obtenu le résultat suivant :

    - XXX € / mois pour la prestation «  ».

    Mais XXX a fini par m'attribuer le montant suivant :

    - XXX € / mois pour la prestation «  ».

    J'ai bien compris que vous n'étiez pas décisionnaires et ne pourrez pas intervenir en ma faveur.

    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart et améliorer le simulateur pour d'autres utilisateurs.

    Bonne journée,

    ————
    ID : ${resultatsId} (à conserver impérativement pour traitement de votre demande)
    ————`}">Ces résultats ne correspondent pas à ce que l'administration vous a attribué</a>.</li>
          </ul>
          <small v-if="resultatsId">Cette simulation a pour identifiant <span class="preformatted">{{ resultatsId }}</span> (en savoir plus sur <router-link to="/cgu#donnees">le traitement de vos données personnelles</router-link>).</small><br>
          <small
              v-if="openfiscaTracerURL">
            Partenaires :
            <!-- <a
              ui-sref="foyer.resultat.suggestion"
              v-analytics="{ action:'New', category:'Test'}"
              >créez un test</a>
            ou bien -->
            <a
              target="_blank"
              v-bind:href="openfiscaTracerURL"
              v-analytics="{ category:'Tracer' }"
              >accédez à l'outil d'analyse des résultats de cette simulation</a>.
          </small>
        </div>

        <div id="social">
          <p>Suivez-nous sur <router-link to="/social">nos réseaux sociaux</router-link> ! Nos messages privés sont ouverts pour vous permettre de communiquer avec nous en toute discrétion.</p>

          <p style="text-align:center;"><a href="https://www.facebook.com/MesAides"><img src="./../../../public/img/social/picto_facebook.png" alt="Facebook"></a>  <a href="https://twitter.com/MesAides"><img src="/img/social/picto_twitter.png" alt="Twitter"></a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import BenefitCtaLink from './../../components/BenefitCtaLink'
import DroitsList from './../../components/DroitsList'
import DroitsDetails from './../../components/DroitsDetails'
import OfflineResults from './../../components/OfflineResults'

export default {
  name: 'resultat',
  data: function() {
    return {
      openfiscaTracerURL: 'TODO'
    }
  },
  components: {
    BenefitCtaLink,
    DroitsDetails,
    DroitsList,
    OfflineResults
  },
  computed: {
    droits: function() { return this.resultats && this.resultats.droitsEligibles },
    droitsInjectes: function() { return (this.resultats && this.resultats.droitsInjectes) || [] },
    droitsNonEligibles: function() {
      return (this.droitsNonEligiblesShow && this.resultats && this.resultats.droitsNonEligibles) || [] },
    droitsNonEligiblesShown: function() { return this.droitsNonEligibles.filter(i => i.id === "css_participation_forfaitaire") },
    droitsNonEligiblesShow: function() { return this.$store.state.ameliNoticationDone },
    resultatsId: function() { return this.resultats && this.resultats._id || '???' },
    accessStatus: function() { return this.$store.state.access },
    resultatStatus: function() { return this.$store.state.calculs },
    resultats: function() { return this.$store.state.calculs.resultats },
    ressourcesYearMinusTwoCaptured: function() { return this.$store.getters.ressourcesYearMinusTwoCaptured },
    situation: function() { return this.$store.state.situation },
    shouldPatrimoineBeCaptured: function() {
      if (! this.droits) {
        return
      }

      return _.some(this.droits, 'isBaseRessourcesPatrimoine') && this.$store.getters.hasPatrimoine === undefined
    },
    hasWarning: function() {
      return this.accessStatus.forbidden
    },
    hasError: function() {
      return this.resultatStatus.error
    },
    shouldDisplayResults: function() {
      return !(this.resultatStatus.updating || this.hasWarning || this.hasError) && this.droits
    },
    error: function() {
      let value = this.resultatStatus.error && this.resultatStatus.exception
      return (_.isString(value) || value instanceof Error) ? value : JSON.stringify(value, null, 2)
    },
    userAgent: function() {
      return window.navigator.userAgent
    }
  },
  methods: {
    goToFeedback: function(event) {
      this.$ScrollService.go(event, document.getElementById('feedback'));
    },
    isEmpty: function(array) { return ! array || array.length === 0 },
    isNotEmpty: function(array) { return array && array.length !== 0 },
  },
  mounted: function () {
    let p
    if (this.$route.query && this.$route.query.situationId) {
      p = this.$store.dispatch('fetch', this.$route.query.situationId)
    } else if (this.$store.getters.passSanityCheck) {
      p = this.$store.dispatch('save')
    } else {
      return this.$store.dispatch('redirection', route => this.$router.push(route))
    }
    p.then(() => {
      if (! this.$store.state.access.forbidden) {
        this.$store.dispatch('compute')
      }
    })

    let vm = this
    this.stopSubscription = this.$store.subscribe(({type}, { calculs }) => {
      switch (type) {
        case 'setResults':
        {
          calculs.resultats.droitsEligibles.forEach(function(d) {
            vm.$matomo && vm.$matomo.trackEvent('General', 'show', d.label)
          })
          break
        }
        case 'saveComputationFailure':
        {
          vm.$matomo && vm.$matomo.trackEvent('General', 'Error')
          break
        }
      }
    })
  },
  beforeDestroy: function() {
    this.stopSubscription && this.stopSubscription()
  }
}
</script>

<style scoped lang="scss">

.container, .panel {
  opacity: 1;
}

.injected .droit-detail-heading {
  padding: 0;
}
.injected .droit-detail-description p {
  margin: 0;
}

</style>
