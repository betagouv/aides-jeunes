import { nextTick } from "vue"
import { createWebHistory, createRouter } from "vue-router"
import context from "./context/index.js"
import Simulation from "@/lib/simulation.ts"
import { useStore } from "@/stores/index.ts"
import ABTestingService from "@/plugins/ab-testing-service.js"

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
              .fetch(Simulation.getLatestId())
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
          name: "resultatsLieuxDedies",
          path: "resultats/:benefitId/lieux",
          component: () => import("./views/simulation/resultats/lieux.vue"),
          meta: {
            headTitle: `Trouver des lieux d'informations près de chez vous avec le simulateur d'aides ${context.name}`,
          },
        },
        {
          name: "benefitLieuInformations",
          path: "resultats/:benefitId/lieux/:lieu_id/informations",
          component: () =>
            import("./views/simulation/resultats/lieu-informations.vue"),
          meta: {
            headTitle:
              "Informations de l'établissement près de chez vous avec le simulateur d'aides ${context.name}",
          },
        },
        {
          name: "benefitLieuInformationsLight",
          path: "resultats/:benefitId/:lieu_id/informations",
          component: () =>
            import("./views/simulation/resultats/lieu-informations.vue"),
          meta: {
            headTitle:
              "Informations de l'établissement près de chez vous avec le simulateur d'aides ${context.name}",
          },
        },
        {
          name: "situationLieuInformations",
          path: "resultats/lieux/:lieu_id/informations",
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
        {
          name: "resultatsRecapEmail",
          path: "resultats/recapitulatif_email",
          component: () =>
            import("./views/simulation/resultats/recap-email.vue"),
          meta: {
            headTitle: `Recevez par email le récapitulatif de vos réponses avec le simulateur d'aides ${context.name}`,
          },
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
        ABTestingService.setVariant("benefit_result_page", "NewUI")
        ABTestingService.setVariant("en_couple_step", "NewQuestion")
        ABTestingService.setVariant("recap_email_form", "Page")
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
    return { left: 0, top: 0 }
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

    /*
    let title = document.querySelector("h1")
    // if anyone wants to set a tabindex manually, do not overwrite it
    if (title?.tabIndex < 0) {
      // default is -1... https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
      title.tabIndex = -1 //...yet it has to be set to -1 to allow `.focus()`
      title.focus()
    }
    */
  })
})

export default router
