import Home from "@/views/home.vue"
import BaseLayout from "@/components/base-layout.vue"
import Simulation from "@/views/simulation.vue"

const name = "1jeune1solution"

const routes = [
  {
    path: "/accessibilite",
    name: "accessibilite",
    component: () => import("@/views/accessibilite.vue"),
    meta: {
      headTitle: `Accessibilité - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/contact.vue"),
    meta: {
      headTitle: `Contact - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/cgu",
    name: "cgu",
    component: () => import("@/views/cgu.vue"),
    meta: {
      headTitle: `CGU - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/mentions-legales",
    name: "mentions-legales",
    component: () => import("@/views/mentions-legales.vue"),
    meta: {
      headTitle: `Mentions légales - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/confidentialite",
    name: "confidentialite",
    component: () => import("@/views/confidentialite.vue"),
    meta: {
      headTitle: `Politique de confidentialité - Simulateur d'aides ${name}`,
    },
  },
  {
    path: "/stats",
    name: "stats",
    component: () => import("@/views/stats.vue"),
    meta: {
      headTitle: `Statistiques du simulateur d'aides ${name}`,
    },
  },
  {
    path: "/iframe",
    name: "iframe",
    component: () => import("@/views/iframe.vue"),
  },
]

export default {
  Home,
  Layout: BaseLayout,
  Simulation,
  name,
  routes,
}
