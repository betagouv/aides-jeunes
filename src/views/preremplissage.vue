<script setup lang="ts">
import LoadingModal from "@/components/loading-modal.vue"
import InputDate from "@/components/input-date.vue"
import InputDepcom from "@/components/input-depcom.vue"
import InputError from "@/components/input-error.vue"
import { ref, computed, watch, nextTick } from "vue"
import { useStore } from "@/stores/index.js"
import { Answer } from "@lib/types/answer.d.js"
import axios from "axios"
import * as Sentry from "@sentry/vue"

const store = useStore()

const family_name = ref<string | undefined>()
const given_names = ref<string | undefined>()
const birthdate = ref<string | undefined>()
const postcode = ref<string | undefined>()
const gender = ref<string | undefined>()
const email = ref<string | undefined>()
const phone = ref<string | undefined>()
const cityName = ref<string | undefined>()
const updating = ref<boolean>(false)
const formError = ref<boolean>(false)
const prefillSuccess = ref<boolean>(false)
const formRef = ref<HTMLFormElement | null>(null)

// On form submit, form is hidden => scroll to the top of the page
watch(prefillSuccess, (newValue) => {
  if (newValue === true) {
    nextTick(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
})

const handleNomCommuneUpdate = (nomCommune: string) => {
  cityName.value = nomCommune
}
const handleCodePostalUpdate = (codePostal: string) => {
  postcode.value = codePostal
}

const formData = computed(() => {
  return {
    family_name: family_name.value,
    given_names: given_names.value,
    birthdate: birthdate.value,
    gender: gender.value,
    birthplace_insee_code: postcode.value,
    birthcountry_insee_code: "99100",
    email: email.value || null,
    phone: phone.value || null,
  }
})

const isFormDataValid = computed(() => {
  if (
    !formData.value.family_name ||
    !formData.value.given_names ||
    !formData.value.birthdate ||
    !formData.value.gender ||
    !formData.value.birthplace_insee_code ||
    !formData.value.birthcountry_insee_code
  ) {
    return false
  }
  return true
})

const storeAnswer = (id: string, fieldName: string, value: any) => {
  const answer: Answer = {
    id,
    entityName: "individu",
    fieldName,
    value,
  }
  store.answer(answer)
}

const storePivotDataAnswer = (data: { id: string; token: string }) => {
  if (data.id && data.token) {
    storeAnswer("demandeur", "pivot-data", data)
  } else {
    console.error("Missing response data API (id, token)", data)
  }
}

const storeBirthdateAnswer = () => {
  storeAnswer("demandeur", "date_naissance", birthdate.value)
}

const submitPrefillData = async () => {
  try {
    formError.value = false
    prefillSuccess.value = false

    if (!isFormDataValid.value && !formRef.value?.checkValidity()) {
      formError.value = true
      throw new Error("Missing required fields")
    }

    const pivotApiUrl: string | undefined = process.env.VITE_PIVOT_URL
    if (!pivotApiUrl) {
      throw new Error("Missing pivot api url")
    }

    updating.value = true
    const response = await axios.post(`${pivotApiUrl}/users`, {
      ...formData.value,
    })

    if (response.status !== 201) {
      throw new Error("POST request ", response.data)
    }

    storePivotDataAnswer(response.data)
    storeBirthdateAnswer()
    prefillSuccess.value = true
  } catch (error) {
    console.error(error)
    if ((error as Error).message !== "Missing required fields") {
      Sentry.captureException(error)
    }
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <article class="fr-article">
    <LoadingModal v-if="updating">
      <p>Chargement en cours…</p>
    </LoadingModal>
    <form v-if="!prefillSuccess" ref="formRef">
      <h1>Pré-remplissage expérimental</h1>
      <p>
        Pour la mise en place du pré-remplissage, nous avons besoin
        d'informations qui nous permettent de vous identifier et de récupérer
        les données à différents endroits dans l'administration.
      </p>
      <p>
        Dans un premier temps, nous collectons des informations d'identité. Dans
        le cadre de cette expérimentation, toutes les informations d'identité
        sont obligatoires. Vous pouvez toujours faire une simulation anonyme en
        retournant à la page suivante.
      </p>
      <p>
        Nous vous proposons aussi d'indiquer votre email et votre numéro de
        téléphone pour nous permettre de revenir vers vous. L'objectif est de
        vous permettre de découvrir de nouveaux droits et de vous simplifier les
        démarches.
      </p>
      <fieldset class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-px-0 fr-text--lead fr-text--bold"
          >Votre identité</legend
        >
        <p>Tous les champs de cette section sont obligatoires.</p>
        <div class="fr-fieldset__content">
          <div>
            <div
              class="fr-mt-2w fr-input-group"
              :class="!family_name && formError ? 'fr-input-group--error' : ''"
            >
              <label id="" class="fr-label">Nom de naissance</label>
              <div class="fr-container fr-px-0">
                <div class="fr-grid-row">
                  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
                    <div class="fr-form-group">
                      <input
                        v-model="family_name"
                        type="text"
                        class="fr-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <InputError :field-name="family_name" :form-error="formError" />
            </div>
            <div
              class="fr-mt-2w fr-input-group"
              :class="!given_names && formError ? 'fr-input-group--error' : ''"
            >
              <label id="">Prénoms</label>
              <div class="fr-container fr-px-0">
                <div class="fr-grid-row">
                  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-6">
                    <div class="fr-form-group">
                      <input
                        v-model="given_names"
                        type="text"
                        class="fr-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <InputError :field-name="given_names" :form-error="formError" />
            </div>
            <div
              class="fr-container fr-px-0 fr-mt-2w fr-input-group"
              :class="!birthdate && formError ? 'fr-input-group--error' : ''"
            >
              <label id="">Date de naissance</label>
              <div class="fr-container fr-px-0 fr-pt-1w">
                <div class="fr-grid-row">
                  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-6">
                    <div class="fr-form-group">
                      <InputDate v-model="birthdate" />
                    </div>
                  </div>
                </div>
              </div>
              <InputError :field-name="birthdate" :form-error="formError" />
            </div>
            <div
              class="fr-container fr-px-0 fr-mt-2w fr-input-group"
              :class="!cityName && formError ? 'fr-input-group--error' : ''"
            >
              <label id="">Code postal</label>
              <InputDepcom
                v-model="postcode"
                commune-selector-label-override-class="fr-text"
                commune-selector-input-override-class="fr-container fr-px-0 fr-mt-2w"
                @update:nom-commune="handleNomCommuneUpdate"
                @update:code-postal="handleCodePostalUpdate"
              />
              <InputError :field-name="cityName" :form-error="formError" />
            </div>

            <div
              class="fr-mt-2wfr-input-group"
              :class="!gender && formError ? 'fr-input-group--error' : ''"
            >
              <label id="">Sexe indiqué sur votre document d'identité</label>
              <div class="fr-container fr-px-0">
                <div class="fr-grid-row">
                  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-6">
                    <div class="fr-form-group">
                      <div class="fr-radio-group fr-radio-rich fr-mt-1w">
                        <input
                          id="sexe-f"
                          v-model="gender"
                          name="sexe"
                          type="radio"
                          value="f"
                          required
                        />
                        <label class="fr-label" for="sexe-f">
                          <span>Féminin</span>
                        </label>
                      </div>
                      <div class="fr-radio-group fr-radio-rich fr-mt-1w">
                        <input
                          id="sexe-m"
                          v-model="gender"
                          name="sexe"
                          type="radio"
                          value="m"
                          required
                        />
                        <label class="fr-label" for="sexe-m">
                          <span>Masculin</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <InputError :field-name="gender" :form-error="formError" />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-px-0 fr-text--lead fr-text--bold">
          Vos informations de contact
        </legend>
        <p>Les champs de cette section ne sont pas obligatoires.</p>
        <div class="fr-fieldset__content">
          <div>
            <label id="">Numéro de téléphone</label>
            <div class="fr-container fr-px-0 fr-pb-1w">
              <div class="fr-grid-row">
                <div class="fr-col-12 fr-col-sm-6 fr-col-lg-4">
                  <div class="fr-form-group">
                    <input v-model="phone" type="phone" class="fr-input" />
                  </div>
                </div>
              </div>
            </div>
            <label id="">Email</label>
            <div class="fr-container fr-px-0">
              <div class="fr-grid-row">
                <div class="fr-col-12 fr-col-sm-6 fr-col-lg-6">
                  <div class="fr-form-group">
                    <input v-model="email" type="text" class="fr-input" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
      <p>
        En validant ce formulaire, vous acceptez que les informations
        renseignées soient conservées pendant 30 jours. Si des informations de
        contact sont fournies nous pourrons revenir vers vous pour vous apporter
        des informations complémentaires sur le pré-remplissage.
      </p>
      <div class="fr-btns-group fr-btns-group--inline">
        <button
          class="fr-btn fr-btn--secondary"
          type="submit"
          @click.prevent="submitPrefillData"
        >
          Valider
        </button>
      </div>
      <div
        v-if="formError && !isFormDataValid"
        class="fr-alert fr-alert--error"
      >
        <h1 class="fr-alert__title">Formulaire invalide</h1>
        <p
          >Tous les champs nécessaires pour vous identifier doivent être
          complétés.</p
        >
      </div>
    </form>
    <div v-else class="fr-alert fr-alert--success">
      <h1 class="fr-alert__title">Succès de l'envoi</h1>
      <p>
        Merci pour ces informations.
        <a href="/simulation/individu/demandeur/date_naissance">
          Accéder au simulateur
        </a>
      </p>
    </div>
  </article>
</template>
