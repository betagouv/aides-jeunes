import MesAidesLayout from "@/components/mes-aides-layout.vue"
import Home from "@/views/home.vue"
import Simulation from "@/views/simulation.vue"

export default {
  Home,
  routes: [
    {
      path: "/questions-frequentes",
      name: "questions-frequentes",
      component: () => import("@/views/mes-aides.org/questions-frequentes.vue"),
      meta: {
        headTitle: `Questions fréquentes - Simulateur d'aides ${name}`,
      },
    },
  ],
  name: "mes-aides",
  Layout: MesAidesLayout,
  Simulation,
}
