<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import type { Ref } from "vue"
import axios from "axios"

const sending = ref(false)
const sent = ref(false)
const errors = ref<string[]>([])
const generalError = ref("")
const errorFields = ref<string[]>([])
const showInstitutionDropdown = ref(false)

const contributorName = ref("")
const institutionName = ref("")
const institutionSlug = ref("")
const label = ref("")
const description = ref("")
const descriptionMax = 420
const prefix = ref("")
const periodiciteOptions = ["ponctuelle", "annuelle", "mensuelle", "autre"]
const selectedPeriodicite = ref("")
const montant = ref<number | undefined>(undefined)
const legend = ref("")
const unit = ref("€")
const resultType = ref("float")

const prefixOptions = ["le", "la", "les", "l'", "une", "un", "l'aide"]
const unitOptions = ["€", "%", "séances"]
const resultTypeOptions = [
  { value: "float", label: "Valeur numérique" },
  { value: "bool", label: "Éligibilité (Oui / Non)" },
  { value: "mixed", label: "Autre" },
]

const link = ref("")
const teleservice = ref("")
const form = ref("")
const instructions = ref("")

const conditions = ref<string[]>([])
const newCondition = ref("")
const voluntaryConditions = ref<string[]>([])
const newVoluntaryCondition = ref("")

const interestFlagOptions = [
  { value: "", label: "Non" },
  {
    value: "_interetBafa",
    label: "Oui, l'afficher en cas d'intérêt pour le BAFA ou le BAFD",
  },
  {
    value: "_interetPermisDeConduire",
    label: "Oui, l'afficher en cas d'intérêt pour passer le permis de conduire",
  },
  {
    value: "_interetEtudesEtranger",
    label:
      "Oui, l'afficher en cas d'intérêt pour faire des études à l'étranger",
  },
  {
    value: "_interetAidesSanitaireSocial",
    label:
      "Oui, l'afficher en cas d'intérêt pour faire une formation dans le sanitaire et social",
  },
]
const selectedInterestFlag = ref("")

const profilOptions = [
  { value: "collegien", label: "Collégien ou collégienne" },
  { value: "lyceen", label: "Lycéen ou lycéenne" },
  { value: "enseignement_superieur", label: "Dans l'enseignement supérieur" },
  { value: "etudiant", label: "Scolarisé ou scolarisée" },
  { value: "stagiaire", label: "Stagiaire" },
  { value: "apprenti", label: "Apprenti ou apprentie" },
  {
    value: "professionnalisation",
    label: "En contrat de professionnalisation",
  },
  { value: "chomeur", label: "En recherche d'emploi" },
  { value: "salarie", label: "Salarié ou salariée" },
  {
    value: "independant",
    label: "Travailleur indépendant ou travailleuse indépendante",
  },
  { value: "service_civique", label: "En service civique" },
  { value: "beneficiaire_rsa", label: "Bénéficiaire RSA" },
  { value: "situation_handicap", label: "En situation de handicap" },
  { value: "inactif", label: "Inactif ou inactive" },
  { value: "parent", label: "Parent" },
]
const profils = ref<string[]>([])

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

function clearLinkErrors() {
  errorFields.value = errorFields.value.filter(
    (f) => !["link", "teleservice", "form", "instructions"].includes(f),
  )
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
  clearError("institutionName")
}

function onPeriodiciteChange() {
  clearError("periodicite")
}

function toggleProfil(profil: string) {
  toggle(profils, profil)
}

function addCondition() {
  if (newCondition.value.trim()) {
    conditions.value.push(newCondition.value.trim())
    newCondition.value = ""
  }
}

function removeCondition(index: number) {
  conditions.value.splice(index, 1)
}

function addVoluntaryCondition() {
  if (newVoluntaryCondition.value.trim()) {
    voluntaryConditions.value.push(newVoluntaryCondition.value.trim())
    newVoluntaryCondition.value = ""
  }
}

function removeVoluntaryCondition(index: number) {
  voluntaryConditions.value.splice(index, 1)
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
  if (!institutionSlug.value) {
    e.push("Vous devez sélectionner une institution dans la liste proposée")
    ef.push("institutionName")
    if (!firstErrorField) firstErrorField = "institutionName"
  }
  if (!label.value.trim()) {
    e.push("Le titre de l'aide est requis")
    ef.push("label")
    if (!firstErrorField) firstErrorField = "label"
  }
  if (!prefix.value) {
    e.push("L'article défini est requis")
    ef.push("prefix")
    if (!firstErrorField) firstErrorField = "prefix"
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
  if (!selectedPeriodicite.value) {
    e.push("Une périodicité doit être sélectionnée")
    ef.push("periodicite")
    if (!firstErrorField) firstErrorField = "period_" + periodiciteOptions[0]
  }

  // Au moins un lien doit être renseigné
  const hasAtLeastOneLink =
    link.value.trim() ||
    teleservice.value.trim() ||
    form.value.trim() ||
    instructions.value.trim()

  if (!hasAtLeastOneLink) {
    e.push(
      "Au moins un lien doit être renseigné (information, téléservice, formulaire ou instructions)",
    )
    ef.push("link")
    ef.push("teleservice")
    ef.push("form")
    ef.push("instructions")
    if (!firstErrorField) firstErrorField = "link"
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
    // Adapter le payload au format attendu par le backend actuel
    const payload: any = {
      contributorName: contributorName.value.trim(),
      institutionName: institutionName.value.trim(),
      title: label.value.trim(), // Le backend attend 'title' pas 'label'
      description: description.value.trim(),
      periodicite: selectedPeriodicite.value,
      typeCategorie: [], // Pour le moment vide car nous avons retiré cette section
      urls: {
        information: link.value.trim() || undefined,
        teleservice: teleservice.value.trim() || undefined,
        form: form.value.trim() || undefined,
        guide: instructions.value.trim() || undefined,
      },
      criteres: {}, // Les critères complexes ne sont pas dans le formulaire simplifié
      profils: profils.value.slice(),
    }

    // Ajouter institutionSlug seulement s'il existe
    if (institutionSlug.value) {
      payload.institutionSlug = institutionSlug.value
    }

    // Ajouter autresConditions seulement si non vide
    if (conditions.value.length > 0) {
      payload.autresConditions = conditions.value.join("\n")
    }

    await axios.post("/api/contributions/benefit", payload)
    sent.value = true

    // Scroll vers le message de succès
    await nextTick()
    window.scrollTo({ top: 0, behavior: "smooth" })
  } catch (err: any) {
    console.error("Erreur lors de l'envoi:", err.response?.data || err)

    const data = err?.response?.data
    if (data?.missingFields) {
      generalError.value = `Champs manquants : ${data.missingFields.join(", ")}`
      errorFields.value = data.missingFields
    } else if (data?.errors) {
      generalError.value = `Erreurs : ${JSON.stringify(data.errors)}`
    } else {
      generalError.value =
        data?.message || "Erreur lors de l'envoi de la contribution"
    }

    // Scroll vers le message d'erreur
    await nextTick()
    const alertElement = document.querySelector(".fr-alert--error")
    if (alertElement) {
      alertElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
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
      simulateur. Les champs marqués d'une étoile
      <span class="fr-text--error">(*)</span> sont obligatoires. Un membre de
      l'équipe relira votre proposition avant publication.
    </p>
    <div v-if="sent" class="fr-alert fr-alert--success fr-mb-4w">
      <p>
        Merci, votre proposition a bien été envoyée ! Elle sera relue par notre
        équipe avant d’être publiée sur le simulateur.
      </p>
    </div>
    <div v-if="errors.length" class="fr-alert fr-alert--error fr-mb-4w">
      <p class="fr-text--bold">Veuillez corriger les erreurs suivantes :</p>
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
                >Votre nom (affiché publiquement)
                <span class="fr-text--error">*</span></label
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
                >Nom de l'institution porteuse
                <span class="fr-text--error">*</span></label
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
              'fr-input-group--error': errorFields.includes('label'),
            }"
          >
            <label class="fr-label" for="label"
              >Titre de l'aide <span class="fr-text--error">*</span></label
            >
            <input
              id="label"
              v-model="label"
              class="fr-input"
              required
              @input="clearError('label')"
            />
          </div>
          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('description'),
            }"
          >
            <label class="fr-label" for="description"
              >Description (max {{ descriptionMax }} caractères)
              <span class="fr-text--error">*</span
              ><span class="fr-hint-text"
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
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('prefix'),
            }"
          >
            <label class="fr-label" for="prefix"
              >Article défini <span class="fr-text--error">*</span></label
            >
            <span class="fr-hint-text"
              >L’ajout d’un article défini permet la formation de phrase
              grammaticalement correcte. Par exemple, dans la phrase « Comment
              obtenir l’aide exceptionnelle ? », on choisit le préfixe « l’
              ».</span
            >
            <select
              id="prefix"
              v-model="prefix"
              class="fr-select"
              required
              @change="clearError('prefix')"
            >
              <option value="">Sélectionner un article</option>
              <option
                v-for="option in prefixOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
          <div
            class="fr-mt-4w"
            :class="{
              'fr-fieldset--error fr-pl-2w':
                errorFields.includes('periodicite'),
            }"
          >
            <p class="fr-h6 fr-mb-2w"
              >Périodicité <span class="fr-text--error">*</span></p
            >
            <div class="fr-grid-row fr-grid-row--gutters">
              <div
                v-for="periodicite in periodiciteOptions"
                :key="periodicite"
                class="fr-col-12 fr-col-md-6"
              >
                <div class="fr-radio-group">
                  <input
                    :id="'period_' + periodicite"
                    v-model="selectedPeriodicite"
                    name="periodicite"
                    type="radio"
                    :value="periodicite"
                    @change="onPeriodiciteChange"
                  />
                  <label :for="'period_' + periodicite" class="fr-label">
                    {{ periodicite }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="fr-grid-row fr-grid-row--gutters fr-mt-4w">
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="resultType"
                  >Type du résultat</label
                >
                <select id="resultType" v-model="resultType" class="fr-select">
                  <option
                    v-for="option in resultTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="unit">Unité</label>
                <span class="fr-hint-text"
                  >Il s’agit de spécifier l’unité du montant</span
                >
                <select id="unit" v-model="unit" class="fr-select">
                  <option
                    v-for="option in unitOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="montant"
                  >Montant maximal de l'aide</label
                >
                <input
                  id="montant"
                  v-model="montant"
                  type="number"
                  step="any"
                  class="fr-input"
                  placeholder="Ex: 200"
                />
              </div>
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="legend"
                  >Légende associée au montant</label
                >
                <span class="fr-hint-text"
                  >Par exemple, si vous écrivez "maximum" dans ce champ, et que
                  vous avez indiqué "200 €" en montant, cela affichera "200 €
                  maximum"</span
                >
                <input
                  id="legend"
                  v-model="legend"
                  class="fr-input"
                  placeholder="Ex: maximum, par mois, etc."
                />
              </div>
            </div>
          </div> </div
        ><!-- fermeture .fr-fieldset__content -->
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">
          Liens utiles <span class="fr-text--error">*</span>
        </legend>
        <p class="fr-text--sm fr-mb-3w">
          <strong>Au moins un lien doit être renseigné</strong> (information,
          téléservice, formulaire ou instructions). Ces liens permettront aux
          usagers de trouver plus d'informations ou de faire leur demande.
        </p>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-6">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error': errorFields.includes('link'),
              }"
            >
              <label class="fr-label" for="link"
                >Lien vers la page d'informations de référence</label
              >
              <span class="fr-hint-text"
                >Vers un site institutionnel de préférence (par exemple, pour
                les aides nationales il s'agit souvent de
                service-public.fr)</span
              >
              <input
                id="link"
                v-model="link"
                class="fr-input"
                type="url"
                @input="clearLinkErrors"
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error': errorFields.includes('teleservice'),
              }"
            >
              <label class="fr-label" for="teleservice"
                >Lien vers un téléservice</label
              >
              <span class="fr-hint-text"
                >Lorsqu'il y a la possibilité de faire la démarche en
                ligne</span
              >
              <input
                id="teleservice"
                v-model="teleservice"
                class="fr-input"
                type="url"
                @input="clearLinkErrors"
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error': errorFields.includes('form'),
              }"
            >
              <label class="fr-label" for="form"
                >Lien vers un formulaire à imprimer</label
              >
              <input
                id="form"
                v-model="form"
                class="fr-input"
                type="url"
                @input="clearLinkErrors"
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error': errorFields.includes('instructions'),
              }"
            >
              <label class="fr-label" for="instructions">
                Lien vers des instructions à suivre
              </label>
              <input
                id="instructions"
                v-model="instructions"
                class="fr-input"
                type="url"
                @input="clearLinkErrors"
              />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">
          Conditions non prises en compte par le simulateur
        </legend>
        <p class="fr-text--sm fr-mb-3w">
          Certains critères d’éligibilité ne peuvent pas être demandés (trop
          précis) ni pris en compte (trop complexe) dans le cadre d’un
          simulateur grand public. Cette liste permet d’informer les usagers sur
          ces critères supplémentaires.
        </p>
        <div class="fr-input-group fr-mb-2w">
          <label class="fr-label" for="newCondition"
            >Ajouter une condition</label
          >
          <div style="display: flex; gap: 1rem">
            <input
              id="newCondition"
              v-model="newCondition"
              class="fr-input"
              placeholder="Ex: Signer un contrat d'engagement réciproque (CER)"
              @keyup.enter="addCondition"
            />
            <button
              type="button"
              class="fr-btn fr-btn--secondary"
              @click="addCondition"
            >
              Ajouter
            </button>
          </div>
        </div>
        <ul v-if="conditions.length > 0" class="fr-mb-2w">
          <li
            v-for="(condition, index) in conditions"
            :key="index"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.5rem;
              background: var(--background-alt-grey);
              margin-bottom: 0.5rem;
              border-radius: 0.25rem;
            "
          >
            <span>{{ condition }}</span>
            <button
              type="button"
              class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
              @click="removeCondition(index)"
            >
              Supprimer
            </button>
          </li>
        </ul>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">
          Conditions bénévoles à satisfaire
        </legend>
        <p class="fr-text--sm fr-mb-3w">
          Un lien dynamique vers la plateforme jeveuxaider.gouv.fr s’ajoutera à
          la suite de la dernière condition pour orienter l’utilisateur vers des
          organismes de bénévolat à proximité.
        </p>
        <div class="fr-input-group fr-mb-2w">
          <label class="fr-label" for="newVoluntaryCondition"
            >Ajouter une condition bénévole</label
          >
          <div style="display: flex; gap: 1rem">
            <input
              id="newVoluntaryCondition"
              v-model="newVoluntaryCondition"
              class="fr-input"
              placeholder="Ex: Réaliser 50 heures de bénévolat par an"
              @keyup.enter="addVoluntaryCondition"
            />
            <button
              type="button"
              class="fr-btn fr-btn--secondary"
              @click="addVoluntaryCondition"
            >
              Ajouter
            </button>
          </div>
        </div>
        <ul v-if="voluntaryConditions.length > 0" class="fr-mb-2w">
          <li
            v-for="(condition, index) in voluntaryConditions"
            :key="index"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.5rem;
              background: var(--background-alt-grey);
              margin-bottom: 0.5rem;
              border-radius: 0.25rem;
            "
          >
            <span>{{ condition }}</span>
            <button
              type="button"
              class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
              @click="removeVoluntaryCondition(index)"
            >
              Supprimer
            </button>
          </li>
        </ul>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">Profils concernés</legend>
        <p class="fr-text--xs fr-mb-1w">
          Cette aide est-elle destinée à des publics spécifiques ? (lycéen(ne)s,
          apprenti(e)s, en recherche d’emploi, etc.)
        </p>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div
            v-for="profilOption in profilOptions"
            :key="profilOption.value"
            class="fr-col-12 fr-col-sm-6 fr-col-md-4"
          >
            <div class="fr-checkbox-group">
              <input
                :id="'profil_' + profilOption.value"
                name="profils"
                type="checkbox"
                :checked="profils.includes(profilOption.value)"
                @change="toggleProfil(profilOption.value)"
              />
              <label class="fr-label" :for="'profil_' + profilOption.value">{{
                profilOption.label
              }}</label>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">Intérêt particulier</legend>
        <div class="fr-input-group">
          <label class="fr-label" for="interestFlag"
            >Faut-il limiter l’affichage de l’aide en fonction d’un intérêt
            particulier ?</label
          >
          <span class="fr-hint-text"
            >En fin de parcours, des questions sont posées pour connaître
            certains intérêts des usagers. Cela permet d’éviter d’afficher
            certaines aides qui ne seraient pas pertinentes pour les
            usagers.</span
          >
          <select
            id="interestFlag"
            v-model="selectedInterestFlag"
            class="fr-select"
          >
            <option
              v-for="option in interestFlagOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </fieldset>
      <button class="fr-btn" :disabled="sending">
        <span v-if="sending">
          <span
            class="fr-icon-refresh-line fr-icon--spin"
            aria-hidden="true"
          ></span>
          Envoi en cours...
        </span>
        <span v-else>Envoyer la proposition</span>
      </button>
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
