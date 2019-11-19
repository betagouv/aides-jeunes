import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        var referrer = document.referrer
        if (referrer.match(/ameli\.fr/) || referrer.match(/mes-aides\.gouv\.fr\/ameli/)) {
          return next('ameli')
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
        path: 'demandeur',
        component: () => import(/* webpackChunkName: "demandeur" */ './views/Foyer/Demandeur.vue')
      }, {
        path: 'enfants',
        component: () => import(/* webpackChunkName: "enfants" */ './views/Foyer/Enfants.vue'),
        children: [{
          path: 'ajouter',
          component: () => import(/* webpackChunkName: "enfants" */ './views/Foyer/Enfants/Ajouter.vue'),
        }, {
          name: 'enfants/modifier',
          path: ':id',
          component: () => import(/* webpackChunkName: "enfants" */ './views/Foyer/Enfants/Modifier.vue'),
        }]
      }, {
        path: 'conjoint',
        component: () => import(/* webpackChunkName: "conjoint" */ './views/Foyer/Conjoint.vue')
      }, {
        path: 'logement',
        component: () => import(/* webpackChunkName: "logement" */ './views/Foyer/Logement.vue')
      }, {
        name: 'ressources/types',
        path: ':role/:id?/ressources/types',
        component: () => import(/* webpackChunkName: "ressources-types" */ './views/Foyer/Ressources/Types.vue')
      }, {
        name: 'ressources/montants',
        path: ':role/:id?/ressources/montants',
        component: () => import(/* webpackChunkName: "ressources-montants" */ './views/Foyer/Ressources/Montants.vue')
      }, {
        path: 'ressources/enfants',
        component: () => import(/* webpackChunkName: "ressources-enfants" */ './views/Foyer/Ressources/Enfants.vue')
      }, {
        path: 'pensions-alimentaires',
        component: () => import(/* webpackChunkName: "pensions-alimentaires" */ './views/Foyer/PensionsAlimentaires.vue')
      }, {
        path: 'resultat',
        component: () => import(/* webpackChunkName: "resultat" */ './views/Foyer/Resultat.vue')
      }, {
        path: 'ressources/fiscales',
        component: () => import(/* webpackChunkName: "ressources-fiscales" */ './views/Foyer/Ressources/Fiscales.vue')
      }, {
        path: 'ressources/patrimoine',
        component: () => import(/* webpackChunkName: "ressources-patrimoine" */ './views/Foyer/Ressources/Patrimoine.vue')
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
      path: '/communication',
      name: 'communication',
      component: () => import(/* webpackChunkName: "communication" */ './views/Communication.vue')
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
      path: '/social',
      name: 'social',
      component: () => import(/* webpackChunkName: "social" */ './views/Social.vue')
    },
    {
      path: '/sos',
      name: 'sos',
      component: () => import(/* webpackChunkName: "sos" */ './views/SOS.vue')
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

router.afterEach(to => {
  if (to.preventFocus)
    return

  Vue.nextTick(function() {
    var title = document.querySelector('h1')
    // if anyone wants to set a tabindex manually, do not overwrite it
    if (title && title.tabIndex < 0) {  // default is -1... https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
        title.tabIndex = -1  //...yet it has to be set to -1 to allow `.focus()`
        title.focus()
    }
  })
})

export default router
