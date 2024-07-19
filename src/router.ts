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
      redirect: (to) => `/api/france-connect${to.fullPath}`,
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
          path: "revenir-plus-tard",
          name: "revenirPlusTard",
          component: () => import("./views/simulation/revenir-plus-tard.vue"),
        },
        {
          path: "redirect",
          name: "redirect",
          beforeEnter(to, from, next) {
            const simulationLatestId = Simulations.getLatestId()
            if (simulationLatestId) {
              next(`/simulation${to.query.to || ""}`)
            } else {
              next("/")
            }
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
          name: "resultatsWrapper",
          path: "resultats",
          meta: {
            headTitle: `Les résultats de ma simulation sur le simulateur d'aides ${context.name}`,
          },
          component: () =>
            import("./views/simulation/resultats/resultats-wrapper.vue"),
          children: [
            {
              name: "resultats",
              path: "",
              component: () =>
                import("./views/simulation/resultats/resultats.vue"),
            },
            {
              name: "resultatsDetails",
              path: ":benefitId",
              component: () =>
                import("./views/simulation/resultats/resultats-details.vue"),
              meta: { showBackToResultsButton: true },
            },
            {
              name: "resultatsGroupe",
              path: "groupe/:groupId",
              component: () =>
                import("./views/simulation/resultats/benefits-list.vue"),
              meta: { showBackToResultsButton: true },
            },
            {
              name: "resultatsLieuxGeneriques",
              path: "lieux",
              component: () =>
                import("./views/simulation/resultats/lieux-generiques.vue"),
              meta: { showBackToResultsButton: true },
            },
            {
              name: "resultatInattendu",
              path: "inattendu/:id",
              component: () =>
                import("./views/simulation/resultats/resultat-inattendu.vue"),
              meta: {
                title: "Résultat inattendu",
                showBackToResultsButton: true,
              },
            },
            {
              name: "benefitLieuInformations",
              path: ":benefitId/:lieu_id/informations",
              component: () =>
                import("./views/simulation/resultats/lieu-informations.vue"),
            },
          ],
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
      ],
    },
    {
      path: "/redirection",
      name: "redirection",
      component: () => import("./views/redirection.vue"),
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
      path: "/preview",
      name: "preview",
      component: () => import("./views/preview.vue"),
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
      path: "/parcours",
      name: "parcours",
      component: () => import("./views/parcours.vue"),
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
        ABTestingService.setVariant(
          "aides_bafa",
          "aides_bafa_fusionnees_conserve_position"
        )
        ABTestingService.setVariant("question_debut_chomage", "reformulation")
        ABTestingService.setVariant("Followup_SMS", "show")
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
  // https://router.vuejs.org/guide/advanced/scroll-behavior.html
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
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
      typeof to.name === "string" &&
      !(
        to.name == "redirect" ||
        to.name == "recapitulatif" ||
        to.matched.some((r) => r.name === "resultatsWrapper")
      ) &&
      !store.passSanityCheck &&
      to.query.debug === undefined
    ) {
      return store.redirection((route) => next(route))
    }
  }
  const metaTitle = to.meta.title
  if (metaTitle) {
    if (typeof metaTitle === "function") {
      store.setTitle(metaTitle(to, store.situation))
    } else if (typeof metaTitle === "string") {
      store.setTitle(metaTitle)
    }
  } else {
    store.setTitle("Évaluez vos droits aux aides sociales")
  }

  if (store.error) {
    store.updateError()
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
