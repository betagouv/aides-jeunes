//import Vue from "vue"
import { nextTick } from "vue"
//import Router from "vue-router"
import Home from "./views/Home.vue"
import ABTestingService from "@/plugins/ABTestingService"
import store from "./store"


import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
        headTitle: "Ma simulation sur le simulateur d'aides 1jeune1solution",
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
              name: "bourse_criteres_sociaux_echelon",
              path: "bourse_criteres_sociaux_echelon",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/BourseCriteresSociauxEchelon.vue"
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
              name: "_hasRessources",
              path: "_hasRessources",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Ressources/Enfants.vue"
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
              name: "_bourseCriteresSociauxCommuneDomicileFamilial",
              path: "_bourseCriteresSociauxCommuneDomicileFamilial",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Individu/_BourseCriteresSociauxCommuneDomicileFamilial.vue"
                ),
            },
            {
              name: "IndividuStep",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/Simulation/MutualizedStep.vue"
                ),
            },
            // {
            //   name: "property",
            //   path: ":property/:subproperty?",
            //   component: () =>
            //     import(
            //       /* webpackChunkName: "individu" */ "./views/Simulation/Property.vue"
            //     ),
            // },
          ],
        },
        {
          path: "parents/:fieldName",
          component: () =>
            import(
              /* webpackChunkName: "mutualized-step" */ "./views/Simulation/MutualizedStep.vue"
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
          path: "famille",
          component: () =>
            import(
              /* webpackChunkName: "famille" */ "./views/Simulation/Famille.vue"
            ),
          children: [
            {
              name: "FamilleStep",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/Simulation/MutualizedStep.vue"
                ),
            },
          ],
        },
        {
          path: "menage/statut_occupation_logement",
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
              name: "depcom",
              path: "depcom",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/Simulation/Menage/Depcom.vue"
                ),
            },
            {
              name: "MenageStep",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/Simulation/MutualizedStep.vue"
                ),
            },
          ],
        },
        {
          name: "recapitulatif",
          path: "recapitulatif",
          meta: {
            headTitle:
              "Récapitulatif de vos réponses sur le simulateur d'aides 1jeune1solution",
          },
          component: () =>
            import(
              /* webpackChunkName: "resultats" */ "./views/Simulation/Recapitulatif.vue"
            ),
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
          name: "resultatsAttendus",
          path: "resultats/attendus",
          component: () =>
            import(
              /* webpackChunkName: "attendu" */ "./views/Simulation/Resultats/Attendu.vue"
            ),
          meta: { title: "Résultats attendus" },
        },
        {
          name: "resultatInattendu",
          path: "resultat/inattendu/:id",
          component: () =>
            import(
              /* webpackChunkName: "resultat-inattendu" */ "./views/Simulation/ResultatInattendu.vue"
            ),
          meta: {
            title: "Resultats Attendus ",
          },
        },
        {
          name: "ressourcesFiscales",
          path: "ressources/fiscales",
          component: () =>
            import(
              /* webpackChunkName: "ressources-fiscales" */ "./views/Simulation/Ressources/Fiscales.vue"
            ),
          meta: {
            title: function () {
              return `Les revenus imposables de votre foyer en ${store.state.dates.fiscalYear.label}`
            },
          },
        },
        {
          name: "ressourcesPatrimoine",
          path: "ressources/patrimoine",
          component: () =>
            import(
              /* webpackChunkName: "ressources-patrimoine" */ "./views/Simulation/Ressources/Patrimoine.vue"
            ),
          meta: {
            title: "Votre patrimoine",
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
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const params = new URLSearchParams(document.location.search.substring(1))
  if (from.name === null) {
    store.commit("initialize")
    store.dispatch("openFiscaParameters")
    store.dispatch("verifyBenefitVariables")
    if (
      to.matched.some((r) => r.name === "foyer" || r.name === "simulation") &&
      !to.path.endsWith("/date_naissance") &&
      ["resultats", "resultatsDetails", "resultatsLieuxGeneriques"].indexOf(
        to.name
      ) === -1 &&
      !store.getters.passSanityCheck &&
      to.query.debug === undefined
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
  let meta
  for (let index = route.matched.length - 1; index >= 0; index -= 1) {
    meta = route.matched[index].meta
    if (meta.headTitle) return meta.headTitle
  }
  return DEFAULT_TITLE
}

router.afterEach((to) => {
  if (to.preventFocus) return

  nextTick(function () {
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
