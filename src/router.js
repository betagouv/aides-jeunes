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
          title: 'Votre logement principal',
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
  if (from.name === null) {
    store.commit('initialize')
    store.dispatch('verifyBenefitVariables')
    if (to.matched.some(r => r.name === 'foyer') && ['demandeur', 'resultat'].indexOf(to.name) === -1 && ! store.getters.passSanityCheck) {
      return store.dispatch('redirection', route => next(route))
    }
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
