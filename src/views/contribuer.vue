<script setup lang="ts">
import { ref, computed, nextTick } from "vue"
import type { Ref } from "vue"
import axios from "axios"
import { EventAction, EventCategory } from "@lib/enums/event"
import InstitutionSelect from "@/components/institution-select.vue"
import LoadingOverlay from "@/components/loading-overlay.vue"

const sending = ref(false)
const sent = ref(false)
const errors = ref<string[]>([])
const generalError = ref("")
const errorFields = ref<string[]>([])

const contactEmail = process.env.VITE_CONTACT_EMAIL

const mailContent = {
  subject: "Question - demande d'ajout d'une nouvelle aide",
  body: `Bonjour,

J'ai besoin d'aide pour proposer une nouvelle aide sur le simulateur.

[Décrivez ici votre question ou le problème rencontré]`,
}

const mailAnalytics = {
  action: EventAction.ContactContribuer,
  category: EventCategory.Contact,
}

const contributorName = ref("")
const contributorOrganization = ref("")
const contributorEmail = ref("")
const institutionName = ref("")
const institutionSlug = ref("")
const label = ref("")
const description = ref("")
const descriptionMax = 5000
const periodiciteOptions = [
  { value: "ponctuelle", label: "Ponctuelle" },
  { value: "annuelle", label: "Annuelle" },
  { value: "mensuelle", label: "Mensuelle" },
  { value: "autre", label: "Autre" },
]
const selectedPeriodicite = ref("")
const montant = ref<number | undefined>(undefined)
const legend = ref("")
const unit = ref("€")
const resultType = ref("float")

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

const conditionsText = ref("")
const conditionsMax = 5000

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
  {
    value: "etudiant",
    label: "Scolarisé ou scolarisée (collège + lycée + enseignement supérieur)",
  },
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
  {
    value: "inactif",
    label:
      "Inactif ou inactive (personne ni scolarisée, ni en emploi, ni en formation, ni en recherche d’emploi)",
  },
  { value: "parent", label: "Parent" },
]
const profils = ref<string[]>([])

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

function onPeriodiciteChange() {
  clearError("periodicite")
}

const descriptionCharsLeft = computed(
  () => descriptionMax - description.value.length,
)

const conditionsCharsLeft = computed(
  () => conditionsMax - conditionsText.value.length,
)

function validate(): { isValid: boolean; firstErrorField?: string } {
  const e: string[] = []
  const ef: string[] = []
  let firstErrorField: string | undefined

  if (!contributorEmail.value.trim()) {
    e.push("L'email du contributeur est requis")
    ef.push("contributorEmail")
    if (!firstErrorField) firstErrorField = "contributorEmail"
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contributorEmail.value.trim())
  ) {
    e.push("L'email du contributeur n'est pas valide")
    ef.push("contributorEmail")
    if (!firstErrorField) firstErrorField = "contributorEmail"
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
    if (!firstErrorField)
      firstErrorField = "period_" + periodiciteOptions[0].value
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
  errors.value = []
  errorFields.value = []
  generalError.value = ""
  const validation = validate()
  if (!validation.isValid) {
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
      contributorName: contributorName.value?.trim() || undefined,
      contributorOrganization:
        contributorOrganization.value?.trim() || undefined,
      contributorEmail: contributorEmail.value.trim(),
      institutionName: institutionName.value.trim(),
      label: label.value.trim(),
      description: description.value.trim(),
      periodicite: selectedPeriodicite.value,
      link: link.value.trim() || undefined,
      teleservice: teleservice.value.trim() || undefined,
      form: form.value.trim() || undefined,
      instructions: instructions.value.trim() || undefined,
    }

    // Ajouter institutionSlug seulement s'il existe
    if (institutionSlug.value) {
      payload.institutionSlug = institutionSlug.value
    }

    // Ajouter conditions seulement si non vide
    if (conditionsText.value.trim()) {
      payload.conditions = conditionsText.value.trim()
    }

    await axios.post("/api/contributions/benefit", payload)
    sent.value = true

    // Scroll vers le message de succès
    await nextTick()
    window.scrollTo({ top: 0, behavior: "smooth" })
  } catch (err: any) {
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
    <LoadingOverlay
      :open="sending"
      aria-label="Envoi de la proposition en cours"
      message="Nous préparons votre proposition."
    />
    <h1>Proposer une nouvelle aide</h1>
    <p class="fr-text--md">
      Vous faites partie d'une <b>collectivité territoriale</b> (mairie,
      département, région, EPCI) ou d'un
      <b>établissement public local</b> (CCAS, Mission Locale, etc.) :
      enrichissez le simulateur en ajoutant vos aides à destination des jeunes
      de 15 à 30 ans.
    </p>
    <p class="fr-text--md fr-mb-3w">
      Remplissez ce formulaire pour proposer une nouvelle aide. Les champs
      marqués d'une étoile <span class="fr-text--error">(*)</span> sont requis.
      Votre proposition sera relue par notre équipe avant d'être publiée sur le
      simulateur. Merci pour votre contribution !
    </p>
    <div class="fr-callout fr-callout--info">
      <h6 class="fr-callout__title">Une question ?</h6>
      <p class="fr-callout__text">
        Si vous rencontrez des difficultés pour remplir ce formulaire ou si vous
        avez des questions, n'hésitez pas à contacter notre équipe par email :
        <a v-mail="mailContent" :v-analytics="mailAnalytics" type="mailto">{{
          contactEmail
        }}</a>
      </p>
    </div>
    <hr class="fr-my-4w" />
    <div v-if="sent" class="fr-alert fr-alert--success fr-mb-4w">
      <p>
        Merci, votre proposition a bien été envoyée ! Elle sera relue par notre
        équipe avant d’être publiée sur le simulateur.
      </p>
      <p class="fr-mt-2w">
        <a href="/contribuer" class="fr-link">Proposer une nouvelle aide</a>
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
              <label class="fr-label" for="contributorName">Votre nom</label>
              <input
                id="contributorName"
                v-model="contributorName"
                class="fr-input"
                placeholder="Ex: Jeanne Dupont"
                @input="clearError('contributorName')"
              />
            </div>
          </div>
          <div class="fr-col-12">
            <div class="fr-input-group">
              <label class="fr-label" for="contributorOrganization"
                >Votre organisation</label
              >
              <input
                id="contributorOrganization"
                v-model="contributorOrganization"
                class="fr-input"
                placeholder="Ex: Mairie de Lyon"
              />
            </div>
          </div>
          <div class="fr-col-12">
            <div
              class="fr-input-group"
              :class="{
                'fr-input-group--error':
                  errorFields.includes('contributorEmail'),
              }"
            >
              <label class="fr-label" for="contributorEmail"
                >Votre email <span class="fr-text--error">*</span></label
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
          </div>
          <div class="fr-col-12">
            <InstitutionSelect
              :institution-slug="institutionSlug"
              :institution-name="institutionName"
              :has-error="errorFields.includes('institutionName')"
              @update:institution-slug="
                (val: string) => {
                  institutionSlug = val
                }
              "
              @update:institution-name="
                (val: string) => {
                  institutionName = val
                }
              "
              @clear-error="() => clearError('institutionName')"
            />
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
              placeholder="Ex: Bourse de mobilité internationale Mermoz"
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
              placeholder="Ex: La Région Hauts-de-France a mis en place ce dispositif afin d'aider les étudiants et étudiantes à suivre à l'étranger un parcours de formation dans un établissement d'enseignement supérieur, un stage, ou un séjour de recherche dans un laboratoire."
              required
              @input="clearError('description')"
            />
          </div>
          <div class="fr-input-group">
            <label class="fr-label" for="conditionsText"
              >Conditions générales (max {{ conditionsMax }} caractères)
              <span class="fr-hint-text"
                >{{ conditionsCharsLeft }} restants</span
              ></label
            >
            <textarea
              id="conditionsText"
              v-model="conditionsText"
              class="fr-input"
              rows="5"
              placeholder="Ex: Âge : 18-30 ans. Résidence : Île-de-France. Profil : lycéen, étudiant ou apprenti. Situation : sans emploi depuis au moins 6 mois. Documents requis : preuve de scolarité et justificatif de domicile."
            />
          </div>
          <div
            class="fr-input-group"
            :class="{
              'fr-input-group--error': errorFields.includes('periodicite'),
            }"
          >
            <label class="fr-label" for="periodicite"
              >Périodicité <span class="fr-text--error">*</span></label
            >
            <span class="fr-hint-text"
              >Cette information est affichée avec le montant. Exemple :
              « mensuelle » + 200 € donnera « 200 € par mois ». Si vous
              sélectionnez « autre », aucune périodicité n’est affichée ;
              précisez-la dans la description si besoin.</span
            >
            <select
              id="periodicite"
              v-model="selectedPeriodicite"
              class="fr-select"
              @change="onPeriodiciteChange"
            >
              <option value="" disabled>Sélectionnez une périodicité</option>
              <option
                v-for="periodicite in periodiciteOptions"
                :key="periodicite.value"
                :value="periodicite.value"
              >
                {{ periodicite.label }}
              </option>
            </select>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-mb-4w">
        <legend class="fr-fieldset__legend fr-h4">Résultat de l'aide</legend>
        <div class="fr-fieldset__content">
          <div class="fr-input-group">
            <label class="fr-label" for="resultType">Type du résultat</label>
            <span class="fr-hint-text"
              >Choisissez le format du résultat renvoyé par votre aide : «
              Valeur numérique » pour afficher un montant (exemple : 200 €, 35 €
              par mois, 12 séances gratuites, 100 repas offerts, 25% de
              réduction) ; « Éligibilité Oui/Non » pour indiquer uniquement si
              la personne a droit à l'aide ou non ; « Autre » uniquement pour
              des cas spécifiques (texte personnalisé, message particulier,
              format non standard)</span
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
          <div v-if="resultType !== 'bool'" class="fr-input-group">
            <label class="fr-label" for="montant">Montant de l'aide</label>
            <span class="fr-hint-text"
              >Indiquez le montant maximal que le demandeur pourrait
              obtenir.</span
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
          <div v-if="resultType !== 'bool'" class="fr-input-group">
            <label class="fr-label" for="unit">Unité</label>
            <span class="fr-hint-text">
              Il s'agit de spécifier l'unité du montant
            </span>
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
          <div v-if="resultType !== 'bool'" class="fr-input-group">
            <label class="fr-label" for="legend"
              >Légende associée au montant</label
            >
            <span class="fr-hint-text"
              >Par exemple, si vous écrivez "maximum" dans ce champ, et que vous
              avez indiqué "200" en valeur numérique et "€" en unité, cela
              affichera "200 € maximum."</span
            >
            <input
              id="legend"
              v-model="legend"
              class="fr-input"
              placeholder="Ex: maximum, montant plafond, etc."
            />
          </div>
        </div>
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
        <div class="fr-fieldset__content">
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
                  >Vers un site institutionnel (ex: site web de la mairie, du
                  département, service-public.fr).</span
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
                  'fr-input-group--error': errorFields.includes('form'),
                }"
              >
                <label class="fr-label" for="form"
                  >Lien vers un formulaire à imprimer</label
                >
                <span class="fr-hint-text"
                  >Vers un PDF à télécharger. Si besoin, nous pouvons
                  l’héberger : envoyez-le par email à notre équipe
                  <a
                    v-mail="mailContent"
                    :v-analytics="mailAnalytics"
                    type="mailto"
                    >{{ contactEmail }} </a
                  >.
                </span>
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
                  'fr-input-group--error': errorFields.includes('teleservice'),
                }"
              >
                <label class="fr-label" for="teleservice"
                  >Lien vers un téléservice</label
                >
                <span class="fr-hint-text"
                  >Lorsqu'il y a la possibilité de faire la démarche en
                  ligne.</span
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
                  'fr-input-group--error': errorFields.includes('instructions'),
                }"
              >
                <label class="fr-label" for="instructions">
                  Lien vers des instructions à suivre pour demander l’aide
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
