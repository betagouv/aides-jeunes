import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import store from './store'
import Individu from '@/lib/Individu'

Vue.use(Router)

const kidPagesMeta = { title: 'Les enfants de votre foyer' }

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        let referrer = document.referrer
        if (!store.state.ameliNoticationDone && (referrer.match(/ameli\.fr/) || referrer.match(/mes-aides\.org\/ameli/))) {
          store.commit('setAmeliNoticationDone')
          return next('/ameli')
        }
        next()
      }
    },
    {
      path: '/simulation',
      name: 'simulation',
      redirect: '/simulation/individu/demandeur/date_naissance',
      component: () => import(/* webpackChunkName: "simulation" */ './views/Simulation.vue'),
      children: [{
        name: 'individu',
        path: 'individu/:id',
        redirect: '/simulation/individu/:id/date_naissance',
        component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu.vue'),
        children: [{
          name: 'date_naissance',
          path: 'date_naissance',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/DateNaissance.vue'),
        },
        {
          name: 'handicap',
          path: 'handicap',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Handicap.vue'),
        },
        {
          name: 'taux_incapacite',
          path: 'taux_incapacite',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Handicap/TauxIncapacite.vue'),
        },
        {
          name: 'aah_restriction_substantielle_durable_acces_emploi',
          path: 'aah_restriction_substantielle_durable_acces_emploi',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Handicap/AAHRestrictionSubstantielleDurableAccesEmploi.vue'),
        },
        {
          name: 'inapte_travail',
          path: 'inapte_travail',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/InapteTravail.vue'),
        },
        {
          name: 'date_debut_chomage',
          path: 'date_debut_chomage',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/DateDebutChomage.vue'),
        },
        {
          name: 'ass_precondition_remplie',
          path: 'ass_precondition_remplie',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/AssPreconditionRemplie.vue'),
        },
        {
          name: 'scolarite',
          path: 'scolarite',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Scolarite.vue'),
        },
        {
          name: 'garde_alternee',
          path: 'garde_alternee',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/GardeAlternee.vue'),
        },
        {
          name: 'statut_marital',
          path: 'statut_marital',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/StatutMarital.vue'),
        },
        {
          name: 'echelon_bourse',
          path: 'echelon_bourse',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/EchelonBourse.vue'),
        },
        {
          name: 'enfant_a_charge',
          path: 'enfant_a_charge',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/EnfantACharge.vue'),
        },
        {
          name: 'enfant_place',
          path: 'enfant_place',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/EnfantPlace.vue'),
        },
        {
          name: 'gir',
          path: 'gir',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/GIR.vue'),
        },
        {
          name: 'nationalite',
          path: 'nationalite',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Nationalite.vue'),
        },
        {
          name: 'activite',
          path: 'activite',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Activite.vue'),
        },
        {
          name: 'habite_chez_parents',
          path: 'habite_chez_parents',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/HabiteChezParents.vue'),
        },
        {
          name: '_firstName',
          path: '_firstName',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/_FirstName.vue'),
        },
        {
          name: 'ressources/types',
          path: 'ressources/types',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Ressources/Types.vue'),
        },
        {
          name: 'ressources/montants',
          path: 'ressources/montants/:category',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Ressources/Montants.vue'),
        },
        {
          name: 'property',
          path: ':property/:subproperty?',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Property.vue'),
        }]
      },
      {
        path: 'enfants',
        component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Enfants.vue'),
      },
      {
        path: 'famille',
        component: () => import(/* webpackChunkName: "famille" */ './views/Simulation/Famille.vue'),
        children: [{
          path: 'en_couple',
          component: () => import(/* webpackChunkName: "famille" */ './views/Simulation/Famille/EnCouple.vue'),
        },
        {
          path: 'rsa_isolement_recent',
          component: () => import(/* webpackChunkName: "famille" */ './views/Simulation/Famille/RsaIsolementRecent.vue'),
        },
        {
          path: 'proprietaire_proche_famille',
          component: () => import(/* webpackChunkName: "famille" */ './views/Simulation/Famille/ProprietaireProcheFamille.vue'),
        }]
      }, {
        path: 'logement',
        component: () => import(/* webpackChunkName: "logement" */ './views/Simulation/Logement.vue'),
      }, {
        path: 'menage',
        component: () => import(/* webpackChunkName: "logement" */ './views/Simulation/Menage.vue'),
        children: [{
            name: 'loyer',
            path: 'loyer',
            component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Menage/Loyer.vue'),
        },
        {
          name: 'coloc',
          path: 'coloc',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Menage/Coloc.vue'),
        },
        {
            name: 'logement_chambre',
            path: 'logement_chambre',
            component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Menage/LogementChambre.vue'),
        },
        {
            name: 'participation_frais',
            path: 'participation_frais',
            component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Menage/ParticipationFrais.vue'),
        },
        {
            name: 'depcom',
            path: 'depcom',
            component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Menage/Depcom.vue'),
        }]
      }, {
        path: 'resultats',
        component: () => import(/* webpackChunkName: "resultats" */ './views/Foyer/Resultat.vue'),
      }, {
        path: ':id/:property',
        component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Property.vue'),
      }]
    },
    {
      path: '/foyer',
      name: 'foyer',
      redirect: '/foyer/demandeur',
      component: () => import(/* webpackChunkName: "demandeur" */ './views/Foyer.vue'),
      children: [{
        name: 'demandeur',
        path: 'demandeur',
        component: () => import(/* webpackChunkName: "demandeur" */ './views/Foyer/Demandeur.vue'),
        meta: { title: 'Vous' }
      }, {
        path: 'enfants',
        component: () => import(/* webpackChunkName: "enfants" */ './views/Foyer/Enfants.vue'),
        meta: kidPagesMeta,
        children: [{
          path: 'ajouter',
          component: () => import(/* webpackChunkName: "enfants" */ './views/Foyer/Enfants/Ajouter.vue'),
          meta: kidPagesMeta
        }, {
          name: 'enfants/modifier',
          path: ':id',
          component: () => import(/* webpackChunkName: "enfants" */ './views/Foyer/Enfants/Modifier.vue'),
          meta: kidPagesMeta
        }]
      }, {
        path: 'conjoint',
        component: () => import(/* webpackChunkName: "conjoint" */ './views/Foyer/Conjoint.vue'),
        meta: {
          title: 'Vivez-vous seul·e ou en couple&nbsp;?',
        }
      }, {
        path: 'logement',
        component: () => import(/* webpackChunkName: "logement" */ './views/Foyer/Logement.vue'),
        meta: {
          title: 'Mon logement',
        }
      }, {
        name: 'ressources/types',
        path: ':role/:id?/ressources/types',
        component: () => import(/* webpackChunkName: "ressources-types" */ './views/Foyer/Ressources/Types.vue'),
        meta: {
          title: function(to, situation) {
            const individu = Individu.find(situation, to.params.role, to.params.id)
            return Individu.ressourceHeader(individu)
          }
        }
      }, {
        name: 'ressources/montants',
        path: ':role/:id?/ressources/montants',
        component: () => import(/* webpackChunkName: "ressources-montants" */ './views/Foyer/Ressources/Montants.vue'),
        meta: {
          title: function(to, situation) {
            const individu = Individu.find(situation, to.params.role, to.params.id)
            return Individu.ressourceHeader(individu)
          }
        }
      }, {
        path: 'ressources/enfants',
        component: () => import(/* webpackChunkName: "ressources-enfants" */ './views/Foyer/Ressources/Enfants.vue'),
        meta: {
          title: 'Les ressources de vos enfants'
        }
      }, {
        path: 'pensions-alimentaires',
        component: () => import(/* webpackChunkName: "pensions-alimentaires" */ './views/Foyer/PensionsAlimentaires.vue'),
        meta: {
          title: 'Pensions alimentaires versées'
        }
      }, {
        path: 'extra-pole-emploi',
        component: () => import(/* webpackChunkName: "extra-pole-emploi" */ './views/Foyer/PoleEmploi.vue'),
        meta: {
          title: 'Question Estime Pôle Emploi'
        }
      }, {
        name: 'resultat',
        path: 'resultat',
        component: () => import(/* webpackChunkName: "resultat" */ './views/Foyer/Resultat.vue'),
        meta: {
          title: 'Résultats de votre simulation'
        },
      }, {
        path: 'resultat/attendu',
        component: () => import(/* webpackChunkName: "resultat" */ './views/Foyer/Resultat/Attendu.vue'),
        meta: { title: 'Résultats attendus' }
      }, {
        name: 'resultat/inattendu',
        path: 'resultat/inattendu/:id',
        component: () => import(/* webpackChunkName: "resultat-inattendu" */ './views/Foyer/ResultatInattendu.vue'),
        meta: {
          title: " "
        }
      }, {
        name: 'resultat/lieux',
        path: 'resultat/lieux/:id',
        component: () => import(/* webpackChunkName: "lieux" */ './views/Foyer/Resultat/Lieux.vue'),
        meta: {
          title: "Des lieux près de chez vous"
        }
      }, {
        path: 'ressources/fiscales',
        component: () => import(/* webpackChunkName: "ressources-fiscales" */ './views/Foyer/Ressources/Fiscales.vue'),
        meta: {
          title: function() {
            return `Les revenus imposables de votre foyer en ${ store.state.dates.fiscalYear.label }`
          }
        }
      }, {
        path: 'ressources/patrimoine',
        component: () => import(/* webpackChunkName: "ressources-patrimoine" */ './views/Foyer/Ressources/Patrimoine.vue'),
        meta: {
          title: 'Votre patrimoine'
        }
      }, {
        path: 'recapitulatif',
        component: () => import(/* webpackChunkName: "recapitulatif" */ './views/Foyer/Recapitulatif.vue'),
        meta: {
          title: 'Vos informations'
        }
      }]
    },
    {
      path: '/a-propos',
      name: 'a-propos',
      component: () => import(/* webpackChunkName: "a-propos" */ './views/APropos.vue')
    },
    {
      path: '/a-propos-integre',
      name: 'a-propos-integre',
      component: () => import(/* webpackChunkName: "a-propos-integre" */ './views/AProposIntegre.vue'),
      beforeEnter: (to, from, next) => {
        store.commit('setIframeOrigin', from.path)
        next()
      },
    },
    {
      path: '/ameliorer',
      name: 'ameliorer',
      component: () => import(/* webpackChunkName: "ameliorer" */ './views/Ameliorer.vue')
    },
    {
      path: '/ameli',
      name: 'ameli',
      component: () => import(/* webpackChunkName: "ameli" */ './views/Ameli.vue')
    },
    {
      path: '/auto-entreprise',
      name: 'auto-entreprise',
      component: () => import(/* webpackChunkName: "auto-entreprise" */ './views/AutoEntreprise.vue')
    },
    {
      path: '/experimentations',
      name: 'experimentations',
      component: () => import(/* webpackChunkName: "experimentations" */ './views/Experimentations.vue')
    },
    {
      path: '/financement',
      name: 'financement',
      component: () => import(/* webpackChunkName: "financement" */ './views/Financement.vue')
    },
    {
      path: '/communication/2020-04-08-fonds-solidarites-logement-75-aides',
      component: () => import(/* webpackChunkName: "communication" */ './views/Communication/2020-04-08-fonds-solidarites-logement-75-aides.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import(/* webpackChunkName: "contact" */ './views/Contact.vue')
    },
    {
      path: '/cgu',
      name: 'cgu',
      component: () => import(/* webpackChunkName: "cgu" */ './views/CGU.vue')
    },
    {
      path: '/liens-utiles',
      name: 'liens-utiles',
      component: () => import(/* webpackChunkName: "liens-utiles" */ './views/LiensUtiles.vue')
    },
    {
      name: 'lieux',
      path: '/lieux',
      component: () => import(/* webpackChunkName: "lieux" */ './views/Lieux.vue'),
    },
    {
      name: 'lieux-details',
      path: '/lieux/:commune/:type',
      component: () => import(/* webpackChunkName: "lieux" */ './views/Lieux/Details.vue'),
    },
    {
      path: '/redirection',
      name: 'redirection',
      component: () => import(/* webpackChunkName: "redirection" */ './views/Redirection.vue')
    },
    {
      path: '/social',
      name: 'social',
      component: () => import(/* webpackChunkName: "social" */ './views/Social.vue')
    },
    {
      path: '/sos',
      name: 'sos',
      component: () => import(/* webpackChunkName: "sos" */ './views/SOS.vue')
    },
    {
      path: '/start',
      name: 'start',
      beforeEnter: (to, from, next) => {
        store.dispatch('clear')
        next({path: '/foyer/demandeur', replace: true})
      },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import(/* webpackChunkName: "stats" */ './views/Stats.vue')
    },
    {
      path: '/suivi',
      name: 'suivi',
      component: () => import(/* webpackChunkName: "suivi" */ './views/Suivi.vue')
    },
    {
      path: '/toutes',
      name: 'toutes',
      component: () => import(/* webpackChunkName: "toutes" */ './views/Toutes.vue')
    },
  ],
  scrollBehavior (to/*, from, savedPosition*/) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    return {x: 0, y: 0}
  }
})

router.beforeEach((to, from, next) => {
  const params = new URLSearchParams(document.location.search.substring(1))
  if (from.name === null) {
    store.commit('initialize')
    store.dispatch('verifyBenefitVariables')
    if (to.matched.some(r => r.name === 'foyer') && ['demandeur', 'resultat'].indexOf(to.name) === -1 && ! store.getters.passSanityCheck) {
      return store.dispatch('redirection', route => next(route))
    }

    const iframe = params.get("iframe")
    if (iframe != null) {
      store.commit('setIframeOrigin', null)
    }
  }

  if (store.state.iframeOrigin) {
    store.commit('setIframeOrigin', null)
  }

  const themeColor = params.get("themeColor")
  if (themeColor) {
    store.commit('setThemeColor', themeColor)
  }

  if (to.meta.title) {
    if (typeof to.meta.title === 'function') {
      store.commit('setTitle', to.meta.title(to, store.state.situation))
    } else {
        store.commit('setTitle', to.meta.title)
    }
  } else {
    store.commit('setTitle', 'Évaluez vos droits aux aides sociales')
  }
  next()
})

router.afterEach(to => {
  if (to.preventFocus)
    return

  Vue.nextTick(function() {
    let title = document.querySelector('h1')
    // if anyone wants to set a tabindex manually, do not overwrite it
    if (title && title.tabIndex < 0) {  // default is -1... https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
        title.tabIndex = -1  //...yet it has to be set to -1 to allow `.focus()`
        title.focus()
    }
  })
})

export default router
