<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import type { Ref } from "vue"
import axios from "axios"

interface ContributionPayload {
  contributorName: string
  institutionName: string
  institutionSlug?: string
  title: string
  description: string
  typeCategorie: string[]
  periodicite: string[]
  urls: {
    information?: string
    teleservice?: string
    form?: string
    guide?: string
  }
  criteres: {
    age?: string
    geographie?: string
    regime?: string
    quotientFamilial?: string
    statutLogement?: string
    difficultesLogement?: string
    engagementBenevole?: string
  }
  profils: string[]
  autresConditions?: string
}

const sending = ref(false)
const sent = ref(false)
const errors = ref<string[]>([])
const generalError = ref("")
const errorFields = ref<string[]>([])
const showInstitutionDropdown = ref(false)

const contributorName = ref("")
const institutionName = ref("")
const institutionSlug = ref("")
const title = ref("")
const description = ref("")
const descriptionMax = 420
const typeOptions = [
  "valeur_fixe",
  "paliers",
  "gratuite",
  "contrepartie",
  "autre",
]
const periodiciteOptions = ["ponctuelle", "annuelle", "mensuelle", "autre"]
const selectedTypes = ref<string[]>([])
const selectedPeriodicites = ref<string[]>([])

const urls = ref({
  information: "",
  teleservice: "",
  form: "",
  guide: "",
})

const criteres = ref({
  age: "",
  geographie: "",
  regime: "",
  quotientFamilial: "",
  statutLogement: "",
  difficultesLogement: "",
  engagementBenevole: "",
})

const criterePlaceholders: Record<string, string> = {
  age: "Ex: 18-25 ans",
  geographie: "Ex: Île-de-France",
  regime: "Ex: régime général",
  quotientFamilial: "Ex: QF < 600",
  statutLogement: "Ex: locataire, hébergé",
  difficultesLogement: "Ex: logement précaire",
  engagementBenevole: "Ex: 50h/an de bénévolat",
}

const profilKeys = [
  "college",
  "lycee",
  "enseignement_superieur",
  "stagiaire",
  "apprentissage",
  "formation_sanitaire_sociale",
  "beneficiaire_rsa",
  "recherche_emploi",
  "salarie",
  "interimaire",
  "travailleur_independant",
  "service_civique",
  "mission_locale",
  "handicap",
  "parent",
  "famille_monoparentale",
  "sans_domicile",
  "autre",
]
const profils = ref<string[]>([])

const autresConditions = ref("")

// Liste des institutions pour l'autocomplétion
const institutions = ref<Array<{ slug: string; label: string; type: string }>>(
  [],
)
const filteredInstitutions = computed(() => {
  if (!institutionName.value.trim()) return institutions.value.slice(0, 30)
  const search = institutionName.value.toLowerCase()
  return institutions.value
    .filter((inst) => inst.label.toLowerCase().includes(search))
    .slice(0, 30)
})

// Charger les institutions au montage du composant
onMounted(async () => {
  try {
    const response = await axios.get("/api/institutions")
    institutions.value = response.data
  } catch (error) {
    console.error("Erreur lors du chargement des institutions:", error)
  }
})

function clearError(field: string) {
  const idx = errorFields.value.indexOf(field)
  if (idx >= 0) errorFields.value.splice(idx, 1)
}

function toggle(list: Ref<string[]> | string[], value: string) {
  const target = Array.isArray(list) ? list : list.value
  const idx = target.indexOf(value)
  if (idx >= 0) target.splice(idx, 1)
  else target.push(value)
}

function selectInstitution(institution: {
  slug: string
  label: string
  type: string
}) {
  institutionName.value = institution.label
  institutionSlug.value = institution.slug
  showInstitutionDropdown.value = false
}

function toggleType(type: string) {
  toggle(selectedTypes, type)
  if (selectedTypes.value.length > 0) clearError("types")
}

function togglePeriodicite(periodicite: string) {
  toggle(selectedPeriodicites, periodicite)
  if (selectedPeriodicites.value.length > 0) clearError("periodicites")
}

function toggleProfil(profil: string) {
  toggle(profils, profil)
}

function hideInstitutionDropdown() {
  setTimeout(() => {
    showInstitutionDropdown.value = false
  }, 200)
}

const descriptionCharsLeft = computed(
  () => descriptionMax - description.value.length,
)

function validate(): { isValid: boolean; firstErrorField?: string } {
  const e: string[] = []
  const ef: string[] = []
  let firstErrorField: string | undefined

  if (!contributorName.value.trim()) {
    e.push("Le nom du contributeur est requis")
    ef.push("contributorName")
    if (!firstErrorField) firstErrorField = "contributorName"
  }
  if (!institutionName.value.trim()) {
    e.push("Le nom de l'institution est requis")
    ef.push("institutionName")
    if (!firstErrorField) firstErrorField = "institutionName"
  }
  if (!title.value.trim()) {
    e.push("Le titre est requis")
    ef.push("title")
    if (!firstErrorField) firstErrorField = "title"
  }
  if (!description.value.trim()) {
    e.push("La description est requise")
    ef.push("description")
    if (!firstErrorField) firstErrorField = "description"
  }
  if (description.value.length > descriptionMax) {
    e.push(`La description ne doit pas dépasser ${descriptionMax} caractères`)
    ef.push("description")
    if (!firstErrorField) firstErrorField = "description"
  }
  if (!selectedTypes.value.length) {
    e.push("Au moins un type d'aide doit être sélectionné")
    ef.push("types")
    if (!firstErrorField) firstErrorField = "type_" + typeOptions[0]
  }
  if (!selectedPeriodicites.value.length) {
    e.push("Au moins une périodicité doit être sélectionnée")
    ef.push("periodicites")
    if (!firstErrorField) firstErrorField = "period_" + periodiciteOptions[0]
  }

  errors.value = e
  errorFields.value = ef
  return {
    isValid: !e.length,
    firstErrorField,
  }
}

async function submit() {
  console.log("Submitting form")
  errors.value = []
  errorFields.value = []
  generalError.value = ""
  const validation = validate()
  if (!validation.isValid) {
    console.log("errors", errors.value)
    await nextTick()
    // Scroll to top alert
    const alertElement = document.querySelector(".fr-alert--error")
    if (alertElement) {
      alertElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    return
  }
  sending.value = true
  try {
    const payload: ContributionPayload = {
      contributorName: contributorName.value.trim(),
      institutionName: institutionName.value.trim(),
      institutionSlug: institutionSlug.value,
      title: title.value.trim(),
      description: description.value.trim(),
      typeCategorie: selectedTypes.value.slice(),
      periodicite: selectedPeriodicites.value.slice(),
      urls: { ...urls.value },
      criteres: { ...criteres.value },
      profils: profils.value.slice(),
      autresConditions: autresConditions.value.trim() || undefined,
    }
    await axios.post("/api/contributions/benefit", payload)
    sent.value = true
  } catch (err: any) {
    generalError.value =
      err?.response?.data?.message ||
      "Erreur lors de l'envoi de la contribution"
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="fr-container fr-my-4w">
    <h1>Proposer une nouvelle aide</h1>
    <p class="fr-text--sm fr-mb-3w">
      Remplissez ce formulaire pour proposer une nouvelle aide à ajouter sur le
      site. Les champs non appropriés peuvent être laissés vides. Un membre de
      l'équipe relira votre proposition avant publication.
    </p>
    <div v-if="sent" class="fr-alert fr-alert--success fr-mb-4w">
      <p>
        Merci, votre proposition a bien été envoyée ! Elle sera relue par notre
        équipe avant d’être publiée sur le site.
      </p>
    </div>
    <div v-if="errors.length" class="fr-alert fr-alert--error fr-mb-4w">
      <p>Erreurs dans le formulaire :</p>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
    <div v-if="generalError" class="fr-alert fr-alert--error fr-mb-4w">
      <p>{{ generalError }}</p>
    </div>
    <form v-if="!sent" class="fr-my-4w" novalidate @submit.prevent="submit">
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">
          Identité et institution porteuse
        </legend>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error':
                  errorFields.includes('contributorName'),
              }"
            >
              <label class="fr-label" for="contributorName"
                >Votre nom (affiché publiquement)</label
              >
              <input
                id="contributorName"
                v-model="contributorName"
                class="fr-input"
                placeholder="Votre nom complet"
                required
                @input="clearError('contributorName')"
              />
            </div>
          </div>
          <div class="fr-col-12">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error':
                  errorFields.includes('institutionName'),
              }"
              style="position: relative"
            >
              <label class="fr-label" for="institutionName"
                >Nom de l'institution porteuse</label
              >
              <input
                id="institutionName"
                v-model="institutionName"
                class="fr-input"
                placeholder="Ex: CAF du Loiret"
                required
                @input="clearError('institutionName')"
                @focus="showInstitutionDropdown = true"
                @blur="hideInstitutionDropdown"
              />
              <ul v-if="showInstitutionDropdown" class="institution-dropdown">
                <li
                  v-for="institution in filteredInstitutions"
                  :key="institution.slug"
                  @click="selectInstitution(institution)"
                >
                  {{ institution.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">Aide</legend>
        <div class="fr-fieldset__content">
          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('title'),
            }"
          >
            <label class="fr-label" for="title">Titre de l'aide</label>
            <input
              id="title"
              v-model="title"
              class="fr-input"
              required
              @input="clearError('title')"
            />
          </div>
          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('description'),
            }"
          >
            <label class="fr-label" for="description"
              >Description (max {{ descriptionMax }} caractères)<span
                class="fr-hint-text"
                >{{ descriptionCharsLeft }} restants</span
              ></label
            >
            <textarea
              id="description"
              v-model="description"
              class="fr-input"
              rows="5"
              placeholder="Résumé clair et concis de l'aide"
              required
              @input="clearError('description')"
            />
          </div>
          <div
            class="fr-mt-4w"
            :class="{
              'fr-fieldset--error fr-pl-2w': errorFields.includes('types'),
            }"
          >
            <p class="fr-h6 fr-mb-1w">Type de l'aide</p>
            <div class="fr-grid-row fr-grid-row--gutters">
              <div
                v-for="type in typeOptions"
                :key="type"
                class="fr-col-12 fr-col-sm-6"
              >
                <div class="fr-checkbox-group">
                  <input
                    :id="'type_' + type"
                    name="typeCategorie"
                    type="checkbox"
                    :value="type"
                    :checked="selectedTypes.includes(type)"
                    @change="toggleType(type)"
                  />
                  <label :for="'type_' + type" class="fr-label">
                    {{ type }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            class="fr-mt-4w"
            :class="{
              'fr-fieldset--error fr-pl-2w':
                errorFields.includes('periodicites'),
            }"
          >
            <p class="fr-h6 fr-mb-1w">Périodicité</p>
            <div class="fr-grid-row fr-grid-row--gutters">
              <div
                v-for="periodicite in periodiciteOptions"
                :key="periodicite"
                class="fr-col-12 fr-col-sm-6"
              >
                <div class="fr-checkbox-group">
                  <input
                    :id="'period_' + periodicite"
                    name="periodicite"
                    type="checkbox"
                    :value="periodicite"
                    :checked="selectedPeriodicites.includes(periodicite)"
                    @change="togglePeriodicite(periodicite)"
                  />
                  <label :for="'period_' + periodicite" class="fr-label">
                    {{ periodicite }}
                  </label>
                </div>
              </div>
            </div>
          </div> </div
        ><!-- fermeture .fr-fieldset__content -->
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">Liens utiles</legend>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-6">
            <div class="fr-input-group">
              <label class="fr-label" for="urlInfo">URL information</label>
              <input
                id="urlInfo"
                v-model="urls.information"
                class="fr-input"
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <div class="fr-input-group">
              <label class="fr-label" for="urlTele">URL téléservice</label>
              <input
                id="urlTele"
                v-model="urls.teleservice"
                class="fr-input"
                type="url"
                placeholder="URL du téléservice"
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <div class="fr-input-group">
              <label class="fr-label" for="urlForm"
                >URL formulaire à imprimer</label
              >
              <input
                id="urlForm"
                v-model="urls.form"
                class="fr-input"
                type="url"
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <div class="fr-input-group">
              <label class="fr-label" for="urlGuide">
                URL guide détaillé
              </label>
              <input
                id="urlGuide"
                v-model="urls.guide"
                class="fr-input"
                type="url"
                placeholder="URL du guide officiel"
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">
          Critères d'éligibilité
        </legend>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div
            v-for="(critereValue, critereKey) in criteres"
            :key="critereKey"
            class="fr-col-12 fr-col-md-6"
          >
            <div class="fr-input-group">
              <label class="fr-label" :for="'crit_' + critereKey">{{
                critereKey
              }}</label>
              <input
                :id="'crit_' + critereKey"
                v-model="criteres[critereKey]"
                class="fr-input"
                :placeholder="criterePlaceholders[critereKey] || 'Préciser'"
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">Profils concernés</legend>
        <p class="fr-text--xs fr-mb-1w">Cocher les profils éligibles.</p>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div
            v-for="profilKey in profilKeys"
            :key="profilKey"
            class="fr-col-12 fr-col-sm-6 fr-col-md-4"
          >
            <div class="fr-checkbox-group">
              <input
                :id="'profil_' + profilKey"
                name="profils"
                type="checkbox"
                :checked="profils.includes(profilKey)"
                @change="toggleProfil(profilKey)"
              />
              <label class="fr-label" :for="'profil_' + profilKey">{{
                profilKey
              }}</label>
            </div>
          </div>
        </div>
      </fieldset>
      <div class="fr-mb-4w">
        <h2 class="fr-h4 fr-mb-2w">Autres conditions</h2>
        <div class="fr-input-group">
          <label class="fr-label" for="autresConditions">
            Conditions particulières
          </label>
          <textarea
            id="autresConditions"
            v-model="autresConditions"
            class="fr-input"
            rows="5"
          />
        </div>
      </div>
      <button class="fr-btn" :disabled="sending">Envoyer la proposition</button>
    </form>
  </div>
</template>

<style scoped>
.institution-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-default-grey);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.institution-dropdown li {
  padding: var(--spacing-2v);
  cursor: pointer;
}

.institution-dropdown li:hover {
  background: var(--background-alt-grey);
}
</style>
