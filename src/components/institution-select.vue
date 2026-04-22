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
    <div v-if="selectedInstitution" class="fr-notice fr-notice--info fr-mt-2w">
      <div class="fr-container">
        <div class="fr-notice__body">
          <div>
            <span v-if="selectedInstitution.benefits.length">
              <p class="fr-notice__title"
                >Aides déjà publiées pour cette institution</p
              >
              <ul class="fr-mt-1w fr-mb-0">
                <li
                  v-for="benefit in selectedInstitution.benefits"
                  :key="benefit.id"
                >
                  <a
                    :href="`/aides/${benefit.id}`"
                    class="fr-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ benefit.label }}
                  </a>
                </li>
              </ul>
            </span>
            <p v-else class="fr-notice__title fr-mt-1w fr-mb-0">
              Aucune aide n'est encore associée à cette institution.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { normalizeString } from "@lib/utils"
import institutionsBenefits from "generator:institutions"

interface Institution {
  slug: string
  label: string
  type: string
  benefits: { id: string; label: string }[]
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

const institutions = Object.values(institutionsBenefits).flatMap((group) =>
  group.map((inst) => ({
    slug: inst.id,
    label: inst.label,
    type: inst.type,
    benefits: inst.benefits,
  })),
)

const filter = ref("")
const showDropdown = ref(false)
const debouncedFilter = ref("")
let debounceTimer: number | undefined

const filteredInstitutions = computed(() => {
  const query = normalizeString(debouncedFilter.value)
  if (!query) return institutions
  return institutions.filter((inst) =>
    normalizeString(inst.label).includes(query),
  )
})

const selectedInstitution = computed(() =>
  props.institutionSlug
    ? (institutions.find((inst) => inst.slug === props.institutionSlug) ?? null)
    : null,
)

onMounted(() => {
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
