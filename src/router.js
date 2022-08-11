import { nextTick } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import context from "./context"
import Institution from "@/lib/institution"
import Simulation from "@/lib/simulation"
import { useStore } from "@/stores"

const benefits = Institution.benefits.benefitsMap

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...context.routes,
    {
      path: "/",
      name: "home",
      component: context.Home,
      beforeEnter(to, from, next) {
        const store = useStore()
        let referrer = document.referrer
        // TODO Est-toujours utile ?
        if (
          !store.ameliNoticationDone &&
          (referrer.match(/ameli\.fr/) ||
            referrer.match(/mes-aides\.org\/ameli/))
        ) {
          store.setAmeliNoticationDone()
          return next("/ameli")
        }
        next()
      },
    },
    {
      path: "/simulation",
      name: "simulation",
      redirect: "/simulation/individu/demandeur/date_naissance",
      component: context.Simulation,
      meta: {
        headTitle: `Ma simulation sur le simulateur d'aides ${context.name}`,
      },
      children: [
        {
          path: "redirect",
          name: "redirect",
          beforeEnter(to, from, next) {
            const store = useStore()
            store
              .fetch(Simulation.getLatest())
              .then(() => {
                next(`/simulation${to.query.to || ""}`)
              })
              .catch(() => {
                next("/")
              })
          },
        },
        {
          path: ":parent+/en_savoir_plus",
          name: "en_savoir_plus",
          component: () =>
            import(
              /* webpackChunkName: "en_savoir_plus" */ "./components/en-savoir-plus-content.vue"
            ),
        },
        {
          name: "individu",
          path: "individu/:id",
          redirect: "/simulation/individu/:id/date_naissance",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/simulation/individu.vue"
            ),
          children: [
            {
              name: "bourse_criteres_sociaux_echelon",
              path: "bourse_criteres_sociaux_echelon",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/simulation/individu/bourse-criteres-sociaux-echelon.vue"
                ),
            },
            {
              name: "ressources/types",
              path: "ressources/types",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/simulation/Ressources/types.vue"
                ),
            },
            {
              name: "_hasRessources",
              path: "_hasRessources",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/simulation/Ressources/enfants.vue"
                ),
            },
            {
              name: "ressources/montants",
              path: "ressources/montants/:category",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/simulation/Ressources/montants.vue"
                ),
            },
            {
              name: "_bourseCriteresSociauxCommuneDomicileFamilial",
              path: "_bourseCriteresSociauxCommuneDomicileFamilial",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/simulation/depcom-step.vue"
                ),
            },
            {
              name: "IndividuStep",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/simulation/mutualized-step.vue"
                ),
            },
          ],
        },
        {
          path: "parents/:fieldName",
          component: () =>
            import(
              /* webpackChunkName: "mutualized-step" */ "./views/simulation/mutualized-step.vue"
            ),
        },
        {
          path: "enfants",
          component: () =>
            import(
              /* webpackChunkName: "individu" */ "./views/simulation/enfants.vue"
            ),
        },
        {
          path: "famille",
          component: () =>
            import(
              /* webpackChunkName: "famille" */ "./views/simulation/famille.vue"
            ),
          children: [
            {
              name: "FamilleStep",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/simulation/mutualized-step.vue"
                ),
            },
          ],
        },
        {
          path: "menage/statut_occupation_logement",
          component: () =>
            import(
              /* webpackChunkName: "logement" */ "./views/simulation/logement.vue"
            ),
        },
        {
          path: "menage",
          component: () =>
            import(
              /* webpackChunkName: "logement" */ "./views/simulation/menage.vue"
            ),
          children: [
            {
              name: "loyer",
              path: "loyer",
              component: () =>
                import(
                  /* webpackChunkName: "individu" */ "./views/simulation/Menage/loyer.vue"
                ),
            },
            {
              name: "depcom",
              path: "depcom",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/simulation/depcom-step.vue"
                ),
            },
            {
              name: "MenageStep",
              path: ":fieldName",
              component: () =>
                import(
                  /* webpackChunkName: "mutualized-step" */ "./views/simulation/mutualized-step.vue"
                ),
            },
          ],
        },
        {
          name: "recapitulatif",
          path: "recapitulatif",
          meta: {
            headTitle: `Récapitulatif de vos réponses sur le simulateur d'aides ${context.name}`,
          },
          component: () =>
            import(
              /* webpackChunkName: "resultats" */ "./views/simulation/recapitulatif.vue"
            ),
        },
        {
          name: "resultats",
          path: "resultats",
          meta: {
            headTitle: `Les résultats de ma simulation sur le simulateur d'aides ${context.name}`,
          },
          component: () =>
            import(
              /* webpackChunkName: "resultats" */ "./views/simulation/resultats.vue"
            ),
        },
        {
          name: "resultatsLieuxGeneriques",
          path: "resultats/lieux",
          component: () =>
            import(
              /* webpackChunkName: "lieux" */ "./views/simulation/resultats/lieux-generiques.vue"
            ),
          meta: {
            headTitle: `Trouver de l'aide près de chez vous avec le simulateur d'aides ${context.name}`,
          },
        },
        {
          name: "resultatsLieuxDedies",
          path: "resultats/:benefit_id/lieux",
          component: () =>
            import(
              /* webpackChunkName: "lieux" */ "./views/simulation/resultats/lieux.vue"
            ),
          meta: {
            headTitle: `Trouver des lieux d'informations près de chez vous avec le simulateur d'aides ${context.name}`,
          },
        },
        {
          name: "resultatsAttendus",
          path: "resultats/attendus",
          component: () =>
            import(
              /* webpackChunkName: "attendu" */ "./views/simulation/resultats/attendu.vue"
            ),
          meta: { title: "Résultats attendus" },
        },
        {
          name: "resultatInattendu",
          path: "resultat/inattendu/:id",
          component: () =>
            import(
              /* webpackChunkName: "resultat-inattendu" */ "./views/simulation/resultat-inattendu.vue"
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
              /* webpackChunkName: "ressources-fiscales" */ "./views/simulation/Ressources/fiscales.vue"
            ),
          meta: {
            title() {
              const store = useStore()
              return `Les revenus imposables de votre foyer en ${store.dates.fiscalYear.label}`
            },
          },
        },
        {
          name: "ressourcesPatrimoine",
          path: "ressources/patrimoine",
          component: () =>
            import(
              /* webpackChunkName: "ressources-patrimoine" */ "./views/simulation/Ressources/patrimoine.vue"
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
              /* webpackChunkName: "resultats" */ "./views/simulation/resultats-detail.vue"
            ),
          meta: {
            headTitle: (params) => {
              if (benefits[params.droitId]) {
                const droitLabel = `${benefits[params.droitId].label}`
                return `${droitLabel.charAt(0).toUpperCase()}${droitLabel.slice(
                  1
                )} - Ma simulation d'aides ${context.name}`
              } else {
                return process.env.VITE_TITLE
              }
            },
          },
        },
      ],
    },
    {
      path: "/redirection",
      name: "redirection",
      component: () =>
        import(/* webpackChunkName: "redirection" */ "./views/redirection.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () =>
        import(/* webpackChunkName: "stats" */ "./views/stats.vue"),
      meta: {
        headTitle: `Statistiques du simulateur d'aides ${context.name}`,
      },
    },
    {
      path: "/aides",
      name: "liste-aides",
      component: () =>
        import(/* webpackChunkName: "liste-aides" */ "./views/liste-aides.vue"),
      meta: {
        headTitle: `Toutes les aides du simulateur ${context.name}`,
      },
    },
    {
      path: "/aides/:benefitId",
      name: "aide",
      component: () =>
        import(/* webpackChunkName: "aides" */ "./views/aide.vue"),
      meta: {
        headTitle: (params) => {
          const benefitLabel = benefits[params.benefitId].label
          return benefitLabel
            ? `${benefitLabel.charAt(0).toUpperCase()}${benefitLabel.slice(
              1
            )} - Simulateur d'aides ${context.name}`
            : process.env.VITE_TITLE
        },
      },
    },
    {
      path: "/suivi",
      name: "suivi",
      component: () =>
        import(/* webpackChunkName: "suivi" */ "./views/suivi.vue"),
    },
    {
      path: "/accompagnement",
      name: "liste-accompagnements",
      component: () =>
        import(
          /* webpackChunkName: "accompagnement-liste" */ "./views/accompagnement/liste.vue"
        ),
    },
    {
      path: "/accompagnement/:surveyId",
      name: "accompagnement",
      component: () =>
        import(
          /* webpackChunkName: "accomptagnement" */ "./views/accompagnement/liste.vue"
        ),
    },
    {
      path: "/init-ci",
      name: "init-ci",
      redirect: () => {
        return "/"
      },
    },
  ],
  scrollBehavior(to /*, from, savedPosition*/) {
    if (to.hash) {
      // https://router.vuejs.org/guide/advanced/scroll-behavior.html
      return {
        el: to.hash,
        behavior: "smooth",
      }
    }
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const params = new URLSearchParams(document.location.search.substring(1))
  const store = useStore()
  if (!from.name) {
    if (
      process.env.VITE_CONTEXT !== "production" ||
      to?.redirectedFrom?.fullPath === "/init-ci"
    ) {
      store.verifyBenefitVariables()
    }

    if (
      to.matched.some((r) => r.name === "foyer" || r.name === "simulation") &&
      !to.path.endsWith("/date_naissance") &&
      [
        "redirect",
        "resultats",
        "resultatsDetails",
        "resultatsLieuxGeneriques",
      ].indexOf(to.name) === -1 &&
      !store.passSanityCheck &&
      to.query.debug === undefined
    ) {
      return store.redirection((route) => next(route))
    }

    const iframe = params.get("iframe")
    if (iframe != null) {
      store.setIframeOrigin(null)
    }
  }

  if (store.iframeOrigin) {
    store.setIframeOrigin(null)
  }

  // TODO Est-ce utile ?
  const themeColor = params.get("themeColor")
  if (themeColor) {
    store.setThemeColor(themeColor)
  }

  if (to.meta.title) {
    if (typeof to.meta.title === "function") {
      store.setTitle(to.meta.title(to, store.situation))
    } else {
      store.setTitle(to.meta.title)
    }
  } else {
    store.setTitle("Évaluez vos droits aux aides sociales")
  }

  if (store.error) {
    store.updateError(false)
  }
  if (store.message.text) {
    store.decrementMessageRemainingViewTime()
  }

  next()
})

function getTitleMeta(route) {
  let meta
  for (let index = route.matched.length - 1; index >= 0; index -= 1) {
    meta = route.matched[index].meta
    if (meta.headTitle) {
      if (typeof meta.headTitle === "function") {
        return meta.headTitle(route.params)
      }
      return meta.headTitle
    }
  }
  return process.env.VITE_TITLE
}

router.afterEach((to) => {
  if (to.preventFocus) return

  nextTick(function () {
    document.title = getTitleMeta(to)

    let title = document.querySelector("h1")
    // if anyone wants to set a tabindex manually, do not overwrite it
    if (title?.tabIndex < 0) {
      // default is -1... https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
      title.tabIndex = -1 //...yet it has to be set to -1 to allow `.focus()`
      title.focus()
    }
  })
})

export default router
