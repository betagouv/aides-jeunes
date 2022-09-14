import Home from "@/views/home.vue"
import BaseLayout from "@/components/base-layout.vue"
import Simulation from "@/views/simulation.vue"

const name = process.env.VITE_CONTEXT_NAME

const routes = [
  {
    path: "/accessibilite",
    name: "accessibilite",
    component: () =>
      import(
        /* webpackChunkName: "accessibilite" */ "@/views/accessibilite.vue"
      ),
    meta: {
      headTitle: `Accessibilité - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(/* webpackChunkName: "contact" */ "@/views/contact.vue"),
    meta: {
      headTitle: `Contact - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/cgu",
    name: "cgu",
    component: () => import(/* webpackChunkName: "cgu" */ "@/views/cgu.vue"),
    meta: {
      headTitle: `CGU - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/confidentialite",
    name: "confidentialite",
    component: () =>
      import(/* webpackChunkName: "cgu" */ "@/views/confidentialite.vue"),
    meta: {
      headTitle: `Politique de confidentialité - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/stats",
    name: "stats",
    component: () =>
      import(/* webpackChunkName: "stats" */ "@/views/stats.vue"),
    meta: {
      headTitle: `Statistiques du simulateur d'aides ${name}`,
    },
  },
  {
    path: "/iframe",
    name: "iframe",
    component: () =>
      import(/* webpackChunkName: "iframe" */ "@/views/iframe.vue"),
  },
]

export default {
  Home,
  BaseLayout,
  Simulation,
  name,
  routes,
}
