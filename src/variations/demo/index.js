import Home from "./Home.vue"
import BaseLayout from "./BaseLayout.vue"

const routes = [
  {
    path: "/a-propos",
    name: "a-propos",
    component: () => import(/* webpackChunkName: "static" */ "./APropos.vue"),
  },
]

export default {
  Home,
  BaseLayout,
  name: "demo de 1jeune1solution",
  routes,
}
