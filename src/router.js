import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
        path: 'resultat',
        component: () => import(/* webpackChunkName: "resultat" */ './views/Foyer/Resultat.vue')
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
  ]
})
