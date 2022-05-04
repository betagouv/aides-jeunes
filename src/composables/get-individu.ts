import { useRoute } from "vue-router"
import Individu from "@/../lib/individu"
import { useStore } from "vuex"

export const useGetIndividu = () => {
  const route = useRoute()
  const store = useStore()
  const id = route.params.id as string
  const role = id.split("_")[0]
  const { individu } = Individu.get(store.getters.peopleParentsFirst, role, id)
  return individu
}
