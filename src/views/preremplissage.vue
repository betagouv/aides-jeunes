<script setup lang="ts">
import LoadingModal from "@/components/loading-modal.vue"
import InputDate from "@/components/input-date.vue"
import InputDepcom from "@/components/input-depcom.vue"
import { ref, computed } from "vue"

const family_name = ref(undefined)
const given_names = ref(undefined)
const birthdate = ref(undefined)
const postcode = ref(undefined)
const gender = ref(undefined)
const birthplace_insee_code = ref(undefined)
const birthcountry_insee_code = ref(undefined)
const email = ref(undefined)
const phone = ref(undefined)
const cityName = ref(undefined)
const updating = ref(false)

const handleNomCommuneUpdate = (nomCommune) => {
  cityName.value = nomCommune
}
const handleCodePostalUpdate = (codePostal) => {
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
    email: email.value,
  }
})

const formDataValidation = computed(() => {
  if (
    !formData.value.family_name ||
    !formData.value.given_names ||
    !formData.value.birthdate ||
    !formData.value.gender ||
    !formData.value.birthplace_insee_code ||
    !formData.value.birthcountry_insee_code ||
    !formData.value.email
  ) {
    return false
  }
  return true
})

const submitPrefillData = async () => {
  try {
    if (!formDataValidation.value) {
      throw new Error("Missing required fields")
    }
    const pivotApiUrl: string | undefined = process.env.VITE_PIVOT_URL
    if (!pivotApiUrl) {
      throw new Error("Missing pivot api url")
    }
    const response = await fetch(pivotApiUrl + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify(formData.value),
    })
    const responseData = await response.json()
    console.log("Réponse de l'API :", responseData)
  } catch (error) {
    console.error("POST request error :", error)
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
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr-container fr-px-0 fr-mt-2w">
              <label id="">Date de naissance</label>
              <div class="fr-container fr-px-0">
                <div class="fr-grid-row">
                  <div class="fr-col-12 fr-col-sm-6 fr-col-lg-6">
                    <div class="fr-form-group">
                      <InputDate v-model="birthdate" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr-mt-2w">
              <label id="">Code postal</label>
              <InputDepcom
                v-model="postcode"
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
        <div class="fr-fieldset__content">
          <div>
            <label id="">Numéro de téléphone</label>
            <div class="fr-container fr-px-0">
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
        {{ family_name }}
        {{ given_names }}
        {{ birthdate }}
        {{ gender }}
        {{ postcode }}
        {{ cityName }}
        {{ birthplace_insee_code }}
        {{ birthcountry_insee_code }}
        {{ email }}
        {{ phone }}
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
    </form>
  </article>
</template>
