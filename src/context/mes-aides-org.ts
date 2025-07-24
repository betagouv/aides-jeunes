import MesAidesLayout from "@/components/mes-aides.org/layout.vue"
import Home from "@/components/mes-aides.org/home.vue"
import Simulation from "@/components/mes-aides.org/simulation.vue"

export default {
  Home,
  routes: [
    {
      path: "/iframe",
      name: "iframe",
      component: () => import("@/views/iframe.vue"),
    },
  ],
  name: "mes-aides.org",
  Layout: MesAidesLayout,
  Simulation,
}
