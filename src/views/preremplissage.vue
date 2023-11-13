<script setup lang="ts">
import LoadingModal from "@/components/loading-modal.vue"
import InputDate from "@/components/input-date.vue"
import InputDepcom from "@/components/input-depcom.vue"
import { ref, computed } from "vue"
import { useStore } from "@/stores/index.js"
import { Answer } from "@lib/types/store.d.js"

const store = useStore()

const family_name = ref<string | undefined>()
const given_names = ref<string | undefined>()
const birthdate = ref<string | undefined>()
const postcode = ref<string | undefined>()
const gender = ref<string | undefined>()
const email = ref<string | undefined>()
const phone = ref<string | undefined>()
const cityName = ref<string | undefined>()
const updating = ref(false)
const formError = ref(false)
const prefillSuccess = ref(false)

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
    email: email.value || "",
    phone: phone.value || "",
  }
})

const formDataValidation = computed(() => {
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
  } as Answer
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

    if (!formDataValidation.value) {
      formError.value = true
      throw new Error("Missing required fields")
    }

    const pivotApiUrl: string | undefined = process.env.VITE_PIVOT_URL
    if (!pivotApiUrl) {
      throw new Error("Missing pivot api url")
    }

    updating.value = true
    const response = await fetch(pivotApiUrl + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData.value),
    })
    const responseData = await response.json()
    const responseStatus = await response.status

    if (responseStatus !== 201) {
      throw new Error("POST request error :", responseData)
    }

    storePivotDataAnswer(responseData)
    storeBirthdateAnswer()
    prefillSuccess.value = true
  } catch (error) {
    console.error(error)
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <article class="fr-article">
    <LoadingModal v-if="updating">
      <p>Récupération en cours…</p>
    </LoadingModal>
    <form>
      <h1>Pré-remplissage expérimental</h1>
      <p>
        Pour la mise en place du pré-remplissage, nous avons besoin
        d'informations qui nous permettent de vous identifier et de récupérer
        les données à différents endroits dans l'administration.
      </p>
      <p>
        Dans un premier temps, nous collectons des informations d'identité pour
      </p>
      <fieldset class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-px-0">Votre identité</legend>
        <p>Tous les champs de cette section sont obligatoires.</p>
        <div class="fr-fieldset__content">
          <div>
            <div class="fr-mt-2w">
              <label id="">Nom de naissance</label>
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
            </div>
            <div class="fr-mt-2w">
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
            </div>
            <div class="fr-container fr-px-0 fr-mt-2w">
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
            </div>
            <div class="fr-container fr-px-0 fr-mt-2w">
              <label id="">Code postal</label>
              <InputDepcom
                v-model="postcode"
                commune-selector-label-override-class="fr-text"
                commune-selector-input-override-class="fr-container fr-px-0 fr-mt-2w"
                @update:nom-commune="handleNomCommuneUpdate"
                @update:code-postal="handleCodePostalUpdate"
              />
            </div>

            <div class="fr-mt-2w">
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
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-px-0">
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
      <div class="fr-btns-group fr-btns-group--inline">
        <button
          class="fr-btn fr-btn--secondary"
          type="submit"
          @click.prevent="submitPrefillData"
        >
          Valider
        </button>
      </div>
      <div v-if="formError" class="fr-alert fr-alert--error">
        <h3 class="fr-alert__title">Formulaire invalide</h3>
        <p
          >Tous les champs nécessaires pour vous identifier doivent être
          complétés.</p
        >
      </div>
      <div v-if="prefillSuccess" class="fr-alert fr-alert--success">
        <h3 class="fr-alert__title">Succès de l'envoi</h3>
        <p>
          Merci pour ces informations.
          <a href="/simulation/individu/demandeur/date_naissance"
            >Accéder au simulateur</a
          >
        </p>
      </div>
    </form>
  </article>
</template>
