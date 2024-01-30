import { nextTick } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import context from "./context/index.js"
import Simulations from "@/lib/simulation.js"
import { getTitleFromRoute } from "@/lib/transition.js"
import { useStore } from "@/stores/index.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...context.routes,
    {
      path: "/",
      name: "home",
      component: context.Home,
    },
    {
      path: "/callback",
      name: "callback",
      component: () => import("./views/france-connect-callback.vue"),
    },
    {
      path: "/logout-callback",
      name: "logout-callback",
      beforeEnter(to) {
        document.location = `/api/france-connect${to.href}`
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
              .fetch(Simulations.getLatestId())
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
          component: () => import("./components/en-savoir-plus-content.vue"),
        },
        {
          name: "individu",
          path: "individu/:id",
          redirect: "/simulation/individu/:id/date_naissance",
          component: () => import("./views/simulation/individu.vue"),
          children: [
            {
              name: "ressources/types",
              path: "ressources/types",
              component: () =>
                import("./views/simulation/Ressources/types.vue"),
            },
            {
              name: "_hasRessources",
              path: "_hasRessources",
              component: () =>
                import("./views/simulation/Ressources/enfants.vue"),
            },
            {
              name: "ressources/montants",
              path: "ressources/montants/:category",
              component: () =>
                import("./views/simulation/Ressources/montants.vue"),
            },
            {
              name: "_bourseCriteresSociauxCommuneDomicileFamilial",
              path: "_bourseCriteresSociauxCommuneDomicileFamilial",
              component: () => import("./views/simulation/depcom-step.vue"),
            },
            {
              name: "IndividuStep",
              path: ":fieldName",
              component: () => import("./views/simulation/mutualized-step.vue"),
            },
          ],
        },
        {
          path: "parents/:fieldName",
          component: () => import("./views/simulation/mutualized-step.vue"),
        },
        {
          path: "enfants",
          component: () => import("./views/simulation/enfants.vue"),
        },
        {
          path: "famille",
          component: () => import("./views/simulation/famille.vue"),
          children: [
            {
              name: "FamilleStep",
              path: ":fieldName",
              component: () => import("./views/simulation/mutualized-step.vue"),
            },
          ],
        },
        {
          path: "menage",
          component: () => import("./views/simulation/menage.vue"),
          children: [
            {
              name: "loyer",
              path: "loyer",
              component: () => import("./views/simulation/Menage/loyer.vue"),
            },
            {
              name: "depcom",
              path: "depcom",
              component: () => import("./views/simulation/depcom-step.vue"),
            },
            {
              name: "MenageStep",
              path: ":fieldName",
              component: () => import("./views/simulation/mutualized-step.vue"),
            },
          ],
        },
        {
          name: "recapitulatif",
          path: "recapitulatif",
          meta: {
            headTitle: `Récapitulatif de vos réponses sur le simulateur d'aides ${context.name}`,
          },
          component: () => import("./views/simulation/recapitulatif.vue"),
        },
        {
          name: "resultats",
          path: "resultats",
          meta: {
            headTitle: `Les résultats de ma simulation sur le simulateur d'aides ${context.name}`,
          },
          component: () => import("./views/simulation/resultats.vue"),
        },
        {
          name: "resultatsLieuxGeneriques",
          path: "resultats/lieux",
          component: () =>
            import("./views/simulation/resultats/lieux-generiques.vue"),
          meta: {
            headTitle: `Trouver de l'aide près de chez vous avec le simulateur d'aides ${context.name}`,
          },
        },
        {
          name: "benefitLieuInformations",
          path: "resultats/:benefitId/:lieu_id/informations",
          component: () =>
            import("./views/simulation/resultats/lieu-informations.vue"),
          meta: {
            headTitle:
              "Informations de l'établissement près de chez vous avec le simulateur d'aides ${context.name}",
          },
        },
        {
          name: "resultatInattendu",
          path: "resultat/inattendu/:id",
          component: () => import("./views/simulation/resultat-inattendu.vue"),
          meta: {
            title: "Résultat inattendu",
          },
        },
        {
          name: "ressourcesFiscales",
          path: "ressources/fiscales",
          component: () => import("./views/simulation/Ressources/fiscales.vue"),
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
            import("./views/simulation/Ressources/patrimoine.vue"),
          meta: {
            title: "Votre patrimoine",
          },
        },
        {
          name: "resultatsDetails",
          path: "resultats/:benefitId",
          component: () => import("./views/simulation/resultats-detail.vue"),
        },
      ],
    },
    {
      path: "/redirection",
      name: "redirection",
      component: () => import("./views/redirection.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import("./views/stats.vue"),
      meta: {
        headTitle: `Statistiques du simulateur d'aides ${context.name}`,
      },
    },
    {
      path: "/aides",
      name: "liste-aides",
      component: () => import("./views/liste-aides.vue"),
      meta: {
        headTitle: `Toutes les aides du simulateur ${context.name}`,
      },
    },
    {
      path: "/aides/:benefitId",
      name: "aide",
      component: () => import("./views/aide.vue"),
      meta: {
        headTitle: `Simulateur d'aides ${context.name}`,
      },
    },
    {
      path: "/preremplissage",
      name: "preremplissage",
      component: () => import("./views/preremplissage.vue"),
    },
    {
      path: "/suivi",
      name: "suivi",
      component: () => import("./views/suivi.vue"),
    },
    {
      path: "/accompagnement",
      name: "liste-accompagnements",
      component: () => import("./views/accompagnement/accompagnement.vue"),
    },
    {
      path: "/accompagnement/:followupId",
      name: "accompagnement",
      component: () => import("./views/accompagnement/accompagnement.vue"),
    },
    {
      path: "/init-ci",
      name: "init-ci",
      redirect: () => {
        ABTestingService.setVariant("CTA_EmailRecontact", "version_actuelle")
        return "/"
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "page-introuvable",
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
  },
})

router.beforeEach((to, from, next) => {
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

router.afterEach((to, from) => {
  nextTick(function () {
    // scroll with a hash is managed in scrollBehavior
    if (!to.hash && from.name !== undefined) {
      const header = document.querySelector("h1")
      header?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      })
    }

    document.title = getTitleFromRoute(to)
  })
})

export default router
