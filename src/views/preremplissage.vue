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
                        v-model="family_names"
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
        {{ family_names }}
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
          @click.prevent="submitPrefilData($event)"
        >
          Valider
        </button>
      </div>
    </form>
  </article>
</template>

<script lang="ts">
import LoadingModal from "@/components/loading-modal.vue"
import { useStore } from "@/stores/index.js"
import InputDate from "@/components/input-date.vue"
import InputDepcom from "@/components/input-depcom.vue"

export default {
  name: "Redirection",
  components: {
    InputDate,
    LoadingModal,
    InputDepcom,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      family_names: undefined,
      given_names: undefined,
      birthdate: undefined,
      postcode: undefined,
      gender: undefined,
      birthplace_insee_code: undefined,
      birthcountry_insee_code: undefined,
      email: undefined,
      phone: undefined,
      cityName: undefined,
    }
  },
  methods: {
    submitPrefilData() {
      alert("ok")
    },
    handleNomCommuneUpdate(nomCommune) {
      this.cityName = nomCommune
    },
    handleCodePostalUpdate(codePostal) {
      this.postcode = codePostal
    },
  },
}
</script>
