import Home from "@/views/home.vue"
import BaseLayout from "./base-layout.vue"

const routes = [
  {
    path: "/accessibilite",
    name: "accessibilite",
    component: () =>
      import(
        /* webpackChunkName: "accessibilite" */ "@/views/accessibilite.vue"
      ),
  },
  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(/* webpackChunkName: "contact" */ "@/views/contact.vue"),
  },
  {
    path: "/cgu",
    name: "cgu",
    component: () => import(/* webpackChunkName: "cgu" */ "@/views/cgu.vue"),
  },
  {
    path: "/confidentialite",
    name: "confidentialite",
    component: () =>
      import(/* webpackChunkName: "cgu" */ "@/views/confidentialite.vue"),
  },
  {
    path: "/stats",
    name: "stats",
    component: () =>
      import(/* webpackChunkName: "stats" */ "@/views/stats.vue"),
  },
]

export default {
  Home,
  BaseLayout,
  name: "1jeune1solution",
  routes,
}
