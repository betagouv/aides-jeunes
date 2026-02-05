<template>
  <div>
    <div
      class="fr-input-group"
      :class="{
        'fr-input-group--error': props.hasError,
      }"
      style="position: relative"
    >
      <label class="fr-label" for="institutionName"
        >Nom de l'institution porteuse
        <span class="fr-text--error">*</span></label
      >
      <span class="fr-hint-text"
        >Si votre institution n'apparaît pas dans la liste, vous pouvez
        <router-link to="/contribuer/institution"
          ><b>l'ajouter en cliquant ici</b></router-link
        >.</span
      >
      <input
        id="institutionName"
        v-model="filter"
        class="fr-input"
        type="text"
        placeholder="Ex: CAF du Loiret"
        required
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="hideDropdown"
      />
      <div v-if="showDropdown" class="aj-contribuer-institution-list">
        <button
          v-for="institution in filteredInstitutions"
          :key="institution.slug"
          type="button"
          class="aj-contribuer-institution-option"
          @click="selectInstitution(institution)"
        >
          {{ institution.label }}
        </button>
        <div
          v-if="!filteredInstitutions.length"
          class="aj-contribuer-institution-empty"
        >
          Aucune institution trouvée
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import axios from "axios"
import { matchesAllTerms } from "@/lib/search"

interface Institution {
  slug: string
  label: string
  type: string
}

interface Props {
  institutionSlug?: string
  institutionName?: string
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
  institutionSlug: "",
  institutionName: "",
})

const emit = defineEmits<{
  "update:institutionSlug": [value: string]
  "update:institutionName": [value: string]
  clearError: []
  selected: [value: Institution]
}>()

const institutions = ref<Institution[]>([])
const filter = ref("")
const showDropdown = ref(false)
const debouncedFilter = ref("")
let debounceTimer: number | undefined

const filteredInstitutions = computed(() => {
  const list = institutions.value.filter((inst) =>
    matchesAllTerms(inst.label, debouncedFilter.value),
  )
  return list
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 50)
})

// Charger les institutions au montage du composant
async function loadInstitutions() {
  try {
    const response = await axios.get("/api/institutions")
    institutions.value = response.data
  } catch (error) {
    console.error("Erreur lors du chargement des institutions:", error)
  }
}

onMounted(() => {
  loadInstitutions()
  if (props.institutionName) {
    filter.value = props.institutionName
  }
})

watch(
  () => props.institutionName,
  (value) => {
    if (value !== undefined && value !== filter.value) {
      filter.value = value
    }
  },
)

watch(filter, (value) => {
  if (debounceTimer) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedFilter.value = value
  }, 200)
})

function handleInput() {
  emit("update:institutionSlug", "")
  emit("update:institutionName", filter.value)
  showDropdown.value = true
  emit("clearError")
}

function selectInstitution(institution: Institution) {
  filter.value = institution.label
  emit("update:institutionSlug", institution.slug)
  emit("update:institutionName", institution.label)
  emit("selected", institution)
  showDropdown.value = false
  emit("clearError")
}

function hideDropdown() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>
