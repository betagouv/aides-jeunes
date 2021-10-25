import Home from "./Home.vue"
import BaseLayout from "./BaseLayout.vue"

const routes = [
  {
    path: "/accessibilite",
    name: "accessibilite",
    component: () =>
      import(/* webpackChunkName: "static" */ "./Accessibilite.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import(/* webpackChunkName: "static" */ "./Contact.vue"),
  },
  {
    path: "/cgu",
    name: "cgu",
    component: () => import(/* webpackChunkName: "static" */ "./CGU.vue"),
  },
  {
    path: "/confidentialite",
    name: "confidentialite",
    component: () =>
      import(/* webpackChunkName: "static" */ "./Confidentialite.vue"),
  },
  {
    path: "/stats",
    name: "stats",
    component: () => import(/* webpackChunkName: "static" */ "./Stats.vue"),
  },
]

export default {
  Home,
  BaseLayout,
  name: "1jeune1solution",
  routes,
}
