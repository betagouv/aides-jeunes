import Home from "./home.vue"
import BaseLayout from "./base-layout.vue"

export default {
  Home,
  BaseLayout,
  name: 'mes-aides.org',
  routes: [
    {
      path: "/a-propos",
      name: "a-propos",
      component: () =>
        import(
          /* webpackChunkName: "static" */ "@/variations/mes-aides.org/views/APropos.vue"
        ),
    },
    {
      path: "/ameliorer",
      name: "ameliorer",
      component: () =>
        import(
          /* webpackChunkName: "static" */ "@/variations/mes-aides.org/views/Ameliorer.vue"
        ),
    },
    {
      path: "/liens-utiles",
      name: "liens-utiles",
      component: () =>
        import(
          /* webpackChunkName: "static" */ "@/variations/mes-aides.org/views/LiensUtiles.vue"
        ),
    }
  ],
}
