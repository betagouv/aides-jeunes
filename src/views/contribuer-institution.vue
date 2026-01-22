<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()

const sending = ref(false)
const sent = ref(false)
const errors = ref<string[]>([])
const generalError = ref("")
const errorFields = ref<string[]>([])

const institutionName = ref("")
const institutionType = ref("")
const logoUrl = ref("")
const codeInsee = ref("")
const codeSiren = ref("")
const contributorEmail = ref("")

const institutionTypeOptions = [
  { value: "commune", label: "Commune" },
  { value: "epci", label: "EPCI (Métropole, inter-communauté, etc.)" },
  { value: "departement", label: "Département" },
  { value: "region", label: "Région" },
  { value: "caf", label: "CAF locale" },
  { value: "msa", label: "MSA locale" },
  { value: "national", label: "Organisation nationale" },
  { value: "europeen", label: "Européen" },
  { value: "autre", label: "Autre" },
]

function clearError(field: string) {
  const idx = errorFields.value.indexOf(field)
  if (idx >= 0) errorFields.value.splice(idx, 1)
}

function validate(): boolean {
  const e: string[] = []
  const ef: string[] = []

  if (!institutionName.value.trim()) {
    e.push("Le nom de l'institution est requis")
    ef.push("institutionName")
  }

  if (!institutionType.value) {
    e.push("Le type d'institution est requis")
    ef.push("institutionType")
  }

  if (!contributorEmail.value.trim()) {
    e.push("Votre email est requis")
    ef.push("contributorEmail")
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contributorEmail.value.trim())
  ) {
    e.push("L'email n'est pas valide")
    ef.push("contributorEmail")
  }

  if (!codeInsee.value.trim() && !codeSiren.value.trim()) {
    e.push("Au moins un code (INSEE ou SIREN) doit être renseigné")
    ef.push("codeInsee")
    ef.push("codeSiren")
  }

  errors.value = e
  errorFields.value = ef
  return !e.length
}

async function submit() {
  errors.value = []
  errorFields.value = []
  generalError.value = ""

  if (!validate()) {
    return
  }

  sending.value = true
  try {
    const payload: any = {
      institutionName: institutionName.value.trim(),
      institutionType: institutionType.value,
      contributorEmail: contributorEmail.value.trim(),
    }

    if (codeInsee.value.trim()) {
      payload.codeInsee = codeInsee.value.trim()
    }

    if (codeSiren.value.trim()) {
      payload.codeSiren = codeSiren.value.trim()
    }

    if (logoUrl.value.trim()) {
      payload.logoUrl = logoUrl.value.trim()
    }

    await axios.post("/api/contributions/institution", payload)

    sent.value = true
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
        data?.message || "Erreur lors de l'envoi de la demande d'institution"
    }
  } finally {
    sending.value = false
  }
}

function goBack() {
  router.push("/contribuer")
}
</script>

<template>
  <div class="fr-container fr-my-4w">
    <button class="fr-btn fr-btn--secondary fr-mb-3w" @click="goBack">
      <span class="fr-icon-arrow-left-line" aria-hidden="true"></span>
      Retour au formulaire de contribution
    </button>
    <h1>Ajouter une nouvelle institution</h1>
    <div v-if="!sent">
      <p class="fr-text--md fr-mb-3w">
        Votre institution n'apparaît pas dans notre liste ? Proposez son ajout
        en remplissant ce formulaire. Les champs marqués d'une étoile
        <span class="fr-text--error">(*)</span> sont obligatoires. Votre
        proposition sera relue par notre équipe avant d'être ajoutée.
      </p>
    </div>
    <div v-else class="fr-alert fr-alert--success fr-mb-4w">
      <p>
        Merci ! Votre demande d'ajout d'institution a bien été envoyée. Elle
        sera traitée par notre équipe dans les meilleurs délais.
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
          Informations sur l'institution
        </legend>
        <div class="fr-fieldset__content">
          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('contributorEmail'),
            }"
          >
            <label class="fr-label" for="contributorEmail"
              >Votre email <span class="fr-text--error">*</span></label
            >
            <span class="fr-hint-text"
              >Pour vous recontacter si nous avons des questions</span
            >
            <input
              id="contributorEmail"
              v-model="contributorEmail"
              class="fr-input"
              type="email"
              placeholder="nom@exemple.fr"
              required
              @input="clearError('contributorEmail')"
            />
          </div>

          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('institutionName'),
            }"
          >
            <label class="fr-label" for="institutionName"
              >Nom de l'institution <span class="fr-text--error">*</span></label
            >
            <span class="fr-hint-text"
              >Exemples : Département de la Gironde, Ville de Canéjan, Mauges
              Communauté, etc.</span
            >
            <input
              id="institutionName"
              v-model="institutionName"
              class="fr-input"
              placeholder="Nom complet de l'institution"
              required
              @input="clearError('institutionName')"
            />
          </div>

          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('institutionType'),
            }"
          >
            <label class="fr-label" for="institutionType"
              >Type d'institution <span class="fr-text--error">*</span></label
            >
            <select
              id="institutionType"
              v-model="institutionType"
              class="fr-select"
              required
              @change="clearError('institutionType')"
            >
              <option value="" disabled>Sélectionnez un type</option>
              <option
                v-for="option in institutionTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="fr-input-group">
            <label class="fr-label" for="logoUrl"
              >URL du logo (optionnel)</label
            >
            <span class="fr-hint-text"
              >Lien vers une image du logo de votre institution</span
            >
            <input
              id="logoUrl"
              v-model="logoUrl"
              class="fr-input"
              type="url"
              placeholder="https://exemple.fr/logo.png"
            />
          </div>
        </div>
      </fieldset>

      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">
          Code INSEE ou code SIREN
        </legend>
        <p class="fr-text--sm fr-mb-3w">
          <strong>Au moins un des champs suivants doit être rempli.</strong> En
          cas de doute, vous pouvez rechercher sur
          <a
            href="https://annuaire-entreprises.data.gouv.fr"
            target="_blank"
            rel="noopener noreferrer"
            >annuaire-entreprises.data.gouv.fr</a
          >
        </p>
        <div class="fr-fieldset__content">
          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('codeInsee'),
            }"
          >
            <label class="fr-label" for="codeInsee">Code INSEE</label>
            <span class="fr-hint-text"
              >Pour les communes, départements, régions</span
            >
            <input
              id="codeInsee"
              v-model="codeInsee"
              class="fr-input"
              placeholder="Ex: 75056"
              @input="clearError('codeInsee')"
            />
          </div>

          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('codeSiren'),
            }"
          >
            <label class="fr-label" for="codeSiren">Code SIREN</label>
            <span class="fr-hint-text">Pour les établissements publics</span>
            <input
              id="codeSiren"
              v-model="codeSiren"
              class="fr-input"
              placeholder="Ex: 123456789"
              pattern="[0-9]{9}"
              @input="clearError('codeSiren')"
            />
          </div>
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
        <span v-else>Envoyer la demande</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.fr-toggle {
  margin-bottom: 1rem;
}
</style>
