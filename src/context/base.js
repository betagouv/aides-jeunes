import Home from "@/views/home.vue"
import BaseLayout from "@/components/base-layout.vue"
import Simulation from "@/views/simulation.vue"

const name = process.env.VUE_APP_CONTEXT_NAME

const routes = [
  {
    component: () =>
      import(
        /* webpackChunkName: "accessibilite" */ "@/views/accessibilite.vue"
      ),
    meta: {
      headTitle: `Accessibilité - Simulateur d'aides ${name}`,
    },
    name: "accessibilite",
    path: "/accessibilite",
  },
  {
    component: () =>
      import(/* webpackChunkName: "contact" */ "@/views/contact.vue"),
    meta: {
      headTitle: `Contact - Simulateur d'aides ${name}`,
    },
    name: "contact",
    path: "/contact",
  },
  {
    component: () => import(/* webpackChunkName: "cgu" */ "@/views/cgu.vue"),
    meta: {
      headTitle: `CGU - Simulateur d'aides ${name}`,
    },
    name: "cgu",
    path: "/cgu",
  },
  {
    component: () =>
      import(/* webpackChunkName: "cgu" */ "@/views/confidentialite.vue"),
    meta: {
      headTitle: `Politique de confidentialité - Simulateur d'aides ${name}`,
    },
    name: "confidentialite",
    path: "/confidentialite",
  },
  {
    component: () =>
      import(/* webpackChunkName: "stats" */ "@/views/stats.vue"),
    meta: {
      headTitle: `Statistiques du simulateur d'aides ${name}`,
    },
    name: "stats",
    path: "/stats",
  },
  {
    component: () =>
      import(/* webpackChunkName: "iframe" */ "@/views/iframe.vue"),
    name: "iframe",
    path: "/iframe",
  },
]

export default {
  BaseLayout,
  Home,
  name,
  routes,
  Simulation,
}
