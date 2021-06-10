import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import ABTestingService from "@/plugins/ABTestingService"
import store from "./store"

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: (to, from, next) => {
        let referrer = document.referrer
        if (
          !store.state.ameliNoticationDone &&
          (referrer.match(/ameli\.fr/) ||
            referrer.match(/mes-aides\.org\/ameli/))
        ) {
          store.commit("setAmeliNoticationDone")
          return next("/ameli")
        }
        next()
      },
    },
    {
      path: "/simulation",
      name: "simulation",
      redirect: "/simulation/individu/demandeur/date_naissance",
      component: () =>
        import(/* webpackChunkName: "simulation" */ "./views/Simulation.vue"),
      meta: {
        headTitle: "Ma simulation sur le simulateur d'aides 1jeune1solution ",
      },
      children: [
        {
          path: ":parent+/en_savoir_plus",
          name: "en_savoir_plus",
          component: () =>
            import(
              /* webpackChunkName: "en_savoir_plus" */ "./components/EnSavoirPlusContent.vue"
            ),
        },
        {
          name: "individu",
          path: "individu/:id",
          redirect: "/simulation/individu/:id/date_naissance",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/Simulation/Individu.vue"
            ),
          children: [
            {
              name: "date_naissance",
              path: "date_naissance",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/DateNaissance.vue"
                ),
            },

            {
              name: "date_debut_chomage",
              path: "date_debut_chomage",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/DateDebutChomage.vue"
                ),
            },
            {
              name: "statut_marital",
              path: "statut_marital",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/StatutMarital.vue"
                ),
            },
            {
              name: "bourse_criteres_sociaux_echelon",
              path: "bourse_criteres_sociaux_echelon",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/BourseCriteresSociauxEchelon.vue"
                ),
            },
            {
              name: "enfant_a_charge",
              path: "enfant_a_charge",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/EnfantACharge.vue"
                ),
            },
            {
              name: "_firstName",
              path: "_firstName",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/_FirstName.vue"
                ),
            },
            {
              name: "ressources/types",
              path: "ressources/types",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Ressources/Types.vue"
                ),
            },
            {
              name: "ressources/montants",
              path: "ressources/montants/:category",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Ressources/Montants.vue"
                ),
            },
            {
              name: "bourse_criteres_sociaux_base_ressources_parentale",
              path: "bourse_criteres_sociaux_base_ressources_parentale",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/BourseCriteresSociauxBaseRessourcesParentale.vue"
                ),
            },
            {
              name: "_bourseCriteresSociauxCommuneDomicileFamilial",
              path: "_bourseCriteresSociauxCommuneDomicileFamilial",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/_BourseCriteresSociauxCommuneDomicileFamilial.vue"
                ),
            },
            {
              name: "_dureeMoisEtudesEtranger",
              path: "_dureeMoisEtudesEtranger",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/_DureeMoisEtudesEtranger.vue"
                ),
            },
            {
              name: "IndividuProperty",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/IndividuProperty.vue"
                ),
            },
            {
              name: "property",
              path: ":property/:subproperty?",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Property.vue"
                ),
            },
          ],
        },
        {
          path: "parents/:fieldName",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/Simulation/ParentProperty.vue"
            ),
        },
        {
          path: "enfants",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/Simulation/Enfants.vue"
            ),
        },
        {
          path: "enfants/ressources",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/Simulation/Ressources/Enfants.vue"
            ),
        },
        {
          path: "famille",
          component: () =>
            import(
              /* webpackChunkName: "famille" */ "./views/Simulation/Famille.vue"
            ),
          children: [
            {
              path: "en_couple",
              component: () =>
                import(
                  /* webpackChunkName: "famille" */ "./views/Simulation/Famille/EnCouple.vue"
                ),
            },
            {
              path: "rsa_isolement_recent",
              component: () =>
                import(
                  /* webpackChunkName: "famille" */ "./views/Simulation/Famille/RsaIsolementRecent.vue"
                ),
            },
            {
              path: "proprietaire_proche_famille",
              component: () =>
                import(
                  /* webpackChunkName: "famille" */ "./views/Simulation/Famille/ProprietaireProcheFamille.vue"
                ),
            },
            {
              name: "bourse_criteres_sociaux_nombre_enfants_a_charge",
              path: "bourse_criteres_sociaux_nombre_enfants_a_charge",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Famille/BourseCriteresSociauxNombreEnfantsACharge.vue"
                ),
            },
            {
              name: "bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur",
              path: "bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Famille/BourseCriteresSociauxNombreEnfantsAChargeDansEnseignementSuperieur.vue"
                ),
            },
            {
              path: "parisien",
              component: () =>
                import(
                  /* webpackChunkName: "famille" */ "./views/Simulation/Famille/Parisien.vue"
                ),
            },
          ],
        },
        {
          path: "logement",
          component: () =>
            import(
              /* webpackChunkName: "logement" */ "./views/Simulation/Logement.vue"
            ),
        },
        {
          path: "menage",
          component: () =>
            import(
              /* webpackChunkName: "logement" */ "./views/Simulation/Menage.vue"
            ),
          children: [
            {
              name: "loyer",
              path: "loyer",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Menage/Loyer.vue"
                ),
            },
            {
              name: "coloc",
              path: "coloc",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Menage/Coloc.vue"
                ),
            },
            {
              name: "logement_chambre",
              path: "logement_chambre",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Menage/LogementChambre.vue"
                ),
            },
            {
              name: "participation_frais",
              path: "participation_frais",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Menage/ParticipationFrais.vue"
                ),
            },
            {
              name: "depcom",
              path: "depcom",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Menage/Depcom.vue"
                ),
            },
          ],
        },
        {
          name: "resultats",
          path: "resultats",
          meta: {
            headTitle:
              "Les résultats de ma simulation sur le simulateur d'aides 1jeune1solution",
          },
          component: () =>
            import(
              /* webpackChunkName: "resultats" */ "./views/Simulation/Resultats.vue"
            ),
        },
        {
          name: "resultatsLieuxGeneriques",
          path: "resultats/lieux",
          component: () =>
            import(
              /* webpackChunkName: "lieux" */ "./views/Simulation/Resultats/LieuxGeneriques.vue"
            ),
          meta: {
            headTitle:
              "Trouver de l'aide près de chez vous avec le simulateur d'aides 1jeune1solution",
          },
        },
        {
          name: "resultatsLieuxDedies",
          path: "resultats/:benefit_id/lieux",
          component: () =>
            import(
              /* webpackChunkName: "lieux" */ "./views/Simulation/Resultats/Lieux.vue"
            ),
          meta: {
            headTitle:
              "Trouver des lieux d'informations près de chez vous avec le simulateur d'aides 1jeune1solution",
          },
        },
        {
          name: "resultatsDetails",
          path: "resultats/:droitId",
          component: () =>
            import(
              /* webpackChunkName: "resultats" */ "./views/Simulation/ResultatsDetail.vue"
            ),
        },
        {
          path: ":id/:property",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/Simulation/Property.vue"
            ),
        },
      ],
    },
    {
      path: "/foyer",
      name: "foyer",
      component: () =>
        import(/* webpackChunkName: "demandeur" */ "./views/Foyer.vue"),
      children: [
        {
          path: "pensions-alimentaires",
          component: () =>
            import(
              /* webpackChunkName: "pensions-alimentaires" */ "./views/Foyer/PensionsAlimentaires.vue"
            ),
          meta: {
            title: "Pensions alimentaires versées",
          },
        },
        {
          path: "extra-pole-emploi",
          component: () =>
            import(
              /* webpackChunkName: "extra-pole-emploi" */ "./views/Foyer/PoleEmploi.vue"
            ),
          meta: {
            title: "Question Estime Pôle Emploi",
          },
        },
        {
          path: "resultat/attendu",
          component: () =>
            import(
              /* webpackChunkName: "resultat" */ "./views/Foyer/Resultat/Attendu.vue"
            ),
          meta: { title: "Résultats attendus" },
        },
        {
          name: "resultat/inattendu",
          path: "resultat/inattendu/:id",
          component: () =>
            import(
              /* webpackChunkName: "resultat-inattendu" */ "./views/Foyer/ResultatInattendu.vue"
            ),
          meta: {
            title: " ",
          },
        },
        {
          path: "ressources/fiscales",
          component: () =>
            import(
              /* webpackChunkName: "ressources-fiscales" */ "./views/Foyer/Ressources/Fiscales.vue"
            ),
          meta: {
            title: function () {
              return `Les revenus imposables de votre foyer en ${store.state.dates.fiscalYear.label}`
            },
          },
        },
        {
          path: "ressources/patrimoine",
          component: () =>
            import(
              /* webpackChunkName: "ressources-patrimoine" */ "./views/Foyer/Ressources/Patrimoine.vue"
            ),
          meta: {
            title: "Votre patrimoine",
          },
        },
        {
          path: "recapitulatif",
          component: () =>
            import(
              /* webpackChunkName: "recapitulatif" */ "./views/Foyer/Recapitulatif.vue"
            ),
          meta: {
            title: "Vos informations",
          },
        },
      ],
    },
    {
      path: "/accessibilite",
      name: "accessibilite",
      component: () =>
        import(
          /* webpackChunkName: "accessibilite" */ "./views/Accessibilite.vue"
        ),
    },
    {
      path: "/contact",
      name: "contact",
      component: () =>
        import(/* webpackChunkName: "contact" */ "./views/Contact.vue"),
    },
    {
      path: "/cgu",
      name: "cgu",
      component: () => import(/* webpackChunkName: "cgu" */ "./views/CGU.vue"),
    },
    {
      path: "/confidentialite",
      name: "confidentialite",
      component: () =>
        import(/* webpackChunkName: "cgu" */ "./views/Confidentialite.vue"),
    },
    {
      name: "lieux-details",
      path: "/lieux/:commune/:type",
      component: () =>
        import(/* webpackChunkName: "lieux" */ "./views/Lieux/Details.vue"),
    },
    {
      path: "/redirection",
      name: "redirection",
      component: () =>
        import(/* webpackChunkName: "redirection" */ "./views/Redirection.vue"),
    },
    {
      path: "/start",
      name: "start",
      beforeEnter: (to, from, next) => {
        store.dispatch("clear")
        next({ path: "/foyer/demandeur", replace: true })
      },
    },
    {
      path: "/stats",
      name: "stats",
      component: () =>
        import(/* webpackChunkName: "stats" */ "./views/Stats.vue"),
    },
    {
      path: "/suivi",
      name: "suivi",
      component: () =>
        import(/* webpackChunkName: "suivi" */ "./views/Suivi.vue"),
    },
    {
      path: "/init-ci",
      name: "init-ci",
      redirect: () => {
        ABTestingService.setVariante("submit", "manual")
        return "/"
      },
    },
  ],
  scrollBehavior(to /*, from, savedPosition*/) {
    if (to.hash) {
      return {
        selector: to.hash,
      }
    }
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const params = new URLSearchParams(document.location.search.substring(1))
  if (from.name === null) {
    store.commit("initialize")
    store.dispatch("verifyBenefitVariables")
    if (
      to.matched.some((r) => r.name === "foyer" || r.name === "simulation") &&
      ["date_naissance", "resultats", "resultatsDetails"].indexOf(to.name) ===
        -1 &&
      !store.getters.passSanityCheck
    ) {
      return store.dispatch("redirection", (route) => next(route))
    }

    const iframe = params.get("iframe")
    if (iframe != null) {
      store.commit("setIframeOrigin", null)
    }
  }

  if (store.state.iframeOrigin) {
    store.commit("setIframeOrigin", null)
  }

  const themeColor = params.get("themeColor")
  if (themeColor) {
    store.commit("setThemeColor", themeColor)
  }

  if (to.meta.title) {
    if (typeof to.meta.title === "function") {
      store.commit("setTitle", to.meta.title(to, store.state.situation))
    } else {
      store.commit("setTitle", to.meta.title)
    }
  } else {
    store.commit("setTitle", "Évaluez vos droits aux aides sociales")
  }

  if (store.state.error) {
    store.dispatch("updateError", false)
  }
  if (store.state.message.text) {
    store.commit("decrementMessageRemainingViewTime")
  }

  next()
})

const DEFAULT_TITLE =
  "Évaluez vos droits aux aides avec le simulateur de 1jeune1solution"

function getTitleMeta(route) {
  let meta = route.meta
  let index = route.matched.length
  while (index >= 0) {
    if (meta.headTitle) return meta.headTitle
    index -= 1
    meta = route.matched[index] && route.matched[index].meta
  }
  return DEFAULT_TITLE
}

router.afterEach((to) => {
  if (to.preventFocus) return

  Vue.nextTick(function () {
    document.title = getTitleMeta(to)

    let title = document.querySelector("h1")
    // if anyone wants to set a tabindex manually, do not overwrite it
    if (title && title.tabIndex < 0) {
      // default is -1... https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
      title.tabIndex = -1 //...yet it has to be set to -1 to allow `.focus()`
      title.focus()
    }
  })
})

export default router
