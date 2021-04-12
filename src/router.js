import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import store from './store'

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
          name: '_interetPermisDeConduire',
          path: '_interetPermisDeConduire',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/_InteretPermisDeConduire.vue'),
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
          name: 'bourse_criteres_sociaux_base_ressources_parentale',
          path: 'bourse_criteres_sociaux_base_ressources_parentale',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/BourseCriteresSociauxBaseRessourcesParentale.vue'),
        },
        {
          name: '_bourseCriteresSociauxCommuneDomicileFamilial',
          path: '_bourseCriteresSociauxCommuneDomicileFamilial',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/_BourseCriteresSociauxCommuneDomicileFamilial.vue'),
        },
        {
          name: 'rsa_jeune_condition_heures_travail_remplie',
          path: 'rsa_jeune_condition_heures_travail_remplie',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/RsaJeuneConditionHeuresTravailRemplie.vue'),
        },
        {
          name: 'classe_scolarite',
          path: 'classe_scolarite',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/ClasseScolarite.vue'),
        },
        {
          name: 'statuts_etablissement_scolaire',
          path: 'statuts_etablissement_scolaire',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/StatutsEtablissementScolaire.vue'),
        },
        {
          name: 'aide_mobilite_parcoursup_sortie_academie',
          path: 'aide_mobilite_parcoursup_sortie_academie',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/AideMobiliteParcoursupSortieAcademie.vue'),
        },
        {
          name: 'aide_mobilite_parcoursup_boursier_lycee',
          path: 'aide_mobilite_parcoursup_boursier_lycee',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/AideMobiliteParcoursupBoursierLycee.vue'),
        },
        {
          name: 'aide_mobilite_master_sortie_region_academique',
          path: 'aide_mobilite_master_sortie_region_academique',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/AideMobiliteMasterSortieRegionAcademique.vue'),
        },
        {
          name: 'boursier',
          path: 'boursier',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Boursier.vue'),
        },
        {
          name: 'alternant',
          path: 'alternant',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Individu/Alternant.vue'),
        },
        {
          name: 'property',
          path: ':property/:subproperty?',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Property.vue'),
        },]
      },
      {
        path: 'enfants',
        component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Enfants.vue'),
      },
      {
        path: 'enfants/ressources',
        component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Ressources/Enfants.vue'),
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
        },
        {
          name: 'bourse_criteres_sociaux_nombre_enfants_a_charge',
          path: 'bourse_criteres_sociaux_nombre_enfants_a_charge',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Famille/BourseCriteresSociauxNombreEnfantsACharge.vue'),
        },
        {
          name: 'bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur',
          path: 'bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur',
          component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Famille/BourseCriteresSociauxNombreEnfantsAChargeDansEnseignementSuperieur.vue'),
        },
        {
          path: 'parisien',
          component: () => import(/* webpackChunkName: "famille" */ './views/Simulation/Famille/Parisien.vue'),
        },
      ]
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
      }, 
      {
        path: 'resultats',
        component: () => import(/* webpackChunkName: "resultats" */ './views/Simulation/Resultats.vue'),
      },
      {
        name: 'resultats/lieux',
        path: 'resultats/:id/lieux',
        component: () => import(/* webpackChunkName: "lieux" */ './views/Simulation/Resultats/Lieux.vue'),
        meta: {
          title: "Des lieux près de chez vous"
        }
      },
      {
        path: 'resultats/:droitId',
        component: () => import(/* webpackChunkName: "resultats" */ './views/Simulation/ResultatsDetail.vue'),
      },
      {
        path: ':id/:property',
        component: () => import(/* webpackChunkName: "individu" */ './views/Simulation/Property.vue'),
      }]
    },
    {
      path: '/foyer',
      name: 'foyer',
      component: () => import(/* webpackChunkName: "demandeur" */ './views/Foyer.vue'),
      children: [{
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
      },
      {
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
      }, 
      {
        path: 'recapitulatif',
        component: () => import(/* webpackChunkName: "recapitulatif" */ './views/Foyer/Recapitulatif.vue'),
        meta: {
          title: 'Vos informations'
        }
      }]
    },
    {
      path: '/accessibilite',
      name: 'accessibilite',
      component: () => import(/* webpackChunkName: "accessibilite" */ './views/Accessibilite.vue')
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
    },    {
      path: '/confidentialite',
      name: 'confidentialite',
      component: () => import(/* webpackChunkName: "cgu" */ './views/Confidentialite.vue')
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
  store.dispatch('updateError', false)

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
