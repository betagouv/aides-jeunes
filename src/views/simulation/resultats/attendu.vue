<template>
  <form @submit.prevent="submit">
    <router-link :to="{ name: 'resultats' }" class="fr-btn fr-btn--sm">
      Retour aux résultats
    </router-link>
    <div v-if="!result">
      <p>
        Ce formulaire permet aux personnes ayant une expertise dans les
        prestations sociales de nous aider à améliorer le simulateur.
      </p>
      <p>Plusieurs situations sont possibles&nbsp;:</p>
      <ul>
        <li>
          vous souhaitez <strong>confirmer</strong> que le résultat obtenu est
          correct ou
        </li>
        <li>
          vous souhaitez indiquer que résultat obtenu est
          <strong>incorrect</strong>.
        </li>
      </ul>
      <p>
        Dans tous les cas, il est important d'expliciter les intentions derrière
        votre validation. En général, il s'agit d'indiquer
        <strong>la règle métier</strong>.
      </p>

      <fieldset
        v-for="(item, index) in selection"
        :key="index"
        class="form__group"
      >
        <legend v-if="item.ref">
          <h2>{{ getTitle(item.ref) }}</h2>
        </legend>
        <div class="form__group">
          <label for="de"
            >Quelle est la prestation pour laquelle vous connaissez le
            résultat&nbsp;?</label
          >
          <select v-model="item.ref">
            <option
              v-for="(benefit, bIndex) in benefits"
              :key="bIndex"
              :value="benefit"
            >
              {{ benefit.label }}
            </option>
          </select>
        </div>

        <div v-if="item.ref" class="form__group">
          <label for="de">La valeur obtenue</label>
          <input :value="getActual(item.ref)" disabled />
        </div>

        <div v-if="item.ref" class="form__group">
          <label for="expected"
            >Quelle est la valeur à laquelle vous vous attendiez&nbsp;?</label
          >
          <input id="expected" v-model="item.expected" />
        </div>
        <div>
          <button class="button small warning" @click.prevent="remove(index)">
            Supprimer cette prestation
          </button>
        </div>
      </fieldset>

      <button class="form__group button secondary" @click.prevent="add">
        Ajouter une autre prestation pour laquelle vous connaissez le résultat
      </button>

      <label class="form__group"
        >Description courte
        <input
          v-model="shortDescription"
          placeholder="Les AL ne sont pas prises en compte dans le RSA"
        />
      </label>

      <label class="form__group"
        >Description détaillée
        <textarea v-model="details" :placeholder="detailed" rows="9" />
      </label>

      <label class="form__group">
        <input v-model="consentGiven" type="checkbox" />
        J'accepte que les données de cette simulation soient visibles en ligne.
        Si les informations correspondent à une situation réelle, vous devriez
        <router-link to="/foyer/recapitulatif">les modifier</router-link>
        .
      </label>

      <WarningMessage v-if="showConsentNotice" class="inline">
        Vous devez accepter la publication des données.
        <router-link to="/foyer/recapitulatif">
          Vous pouvez les anonymiser si nécessaire.
        </router-link>
      </WarningMessage>

      <WarningMessage v-if="message">{{ message }}</WarningMessage>

      <WarningMessage v-if="error">{{ error }}</WarningMessage>

      <div>
        <button :class="`button large ${submitting ? 'secondary' : ''}`">
          Enregistrer
        </button>
        <p v-show="submitting">
          <span
            class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
            aria-hidden="true"
          ></span
          ><span class="fr-ml-2w">Enregistrement en cours…</span>
        </p>
      </div>
    </div>

    <div v-if="result">
      <label class="form__group">
        <textarea
          ref="aj-textarea-results"
          v-model="result"
          class="aj-textarea-results"
          readonly
          rows="9"
          @click="copyToClipboard"
        />
      </label>

      <div>
        <p>
          Vous pouvez nous aider à améliorer le simulateur en nous envoyant par
          mail à
          <a v-mail="sendMail">{{ contactEmail }}</a>
          avec :
        </p>
        <ul>
          <li>
            le contenu du formulaire et en indiquant l'identifiant suivant :
            <span class="bold">{{ store.simulationId }} .</span>
          </li>
          <li>en téléchargeant le fichier avec le bouton ci-dessous.</li>
        </ul>
      </div>
      <div>
        <p
          ><a
            :download="filename"
            :href="resultToBase64"
            class="button large"
            @click="trackMontantAttendu('Téléchargement données')"
          >
            Télécharger le fichier de données
          </a></p
        >
      </div>
      <p>
        Vous pouvez aussi revenir à
        <router-link to="/simulation/resultats">
          la page de résultats.
        </router-link>
      </p>
    </div>
  </form>
</template>

<script>
import axios from "axios"
import Benefits from "@/lib/benefits.js"
import ContactEmailMixin from "@/mixins/contact-email.js"
import ResultatsMixin from "@/mixins/resultats.js"

import { sendMontantsAttendus } from "@/plugins/mails.js"
import { capitalize } from "@lib/utils.ts"
import {
  fetchContributions,
  reduceContributions,
  getGithubPRFiles,
} from "@/lib/contributions.js"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.ts"

export default {
  name: "Attendu",
  components: { WarningMessage },
  mixins: [ContactEmailMixin, ResultatsMixin],
  setup() {
    return { store: useStore() }
  },
  data() {
    let benefitKeyed = {}
    let benefits = []

    Benefits.forEach((benefit) => {
      const b = Object.assign({ type: benefit.institution.type }, benefit)
      b.label = capitalize(benefit.label)

      if (b.label === "Tarification solidaire transports") {
        b.label = `${b.label} - ${benefit.institution.label}`
      }
      benefits.push(b)
      benefitKeyed[b.id] = b
    })

    benefits.sort((a, b) => {
      return a.label.localeCompare(b.label)
    })
    return {
      benefits,
      benefitKeyed,
      consentGiven: false,
      detailed: `Le RSA doit prend en compte les aides au logement. Un 'forfait logement' doit être appliqué cf. l'article R262-9 du Code de l'action sociale et des familles.
- https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000031694445&cidTexte=LEGITEXT000006074069&dateTexte=20171222&fastPos=2&fastReqId=1534790830&oldAction=rechCodeArticle`,
      details: null,
      error: null,
      message: null,
      result: null,
      selection: [{ ref: null, expected: null }],
      shortDescription: null,
      showConsentNotice: false,
      submitting: false,
      institutions: Benefits,
    }
  },
  computed: {
    resultats() {
      let resultats = {}
      const map = [
        {
          prop: "droitsEligibles",
          status: "eligible",
        },
        {
          prop: "droitsInjectes",
          status: "injected",
        },
      ]
      map.forEach((p) => {
        this.store.calculs.resultats[p.prop].forEach((b) => {
          resultats[b.id] = Object.assign({ status: p.status }, b)
        })
      })
      return resultats
    },
    expectedResults() {
      return this.selection.filter((i) => i.ref && i.expected !== null)
    },
    testMetadata() {
      let outputVariables = this.expectedResults.reduce(function (
        results,
        expectedValue
      ) {
        results[expectedValue.ref.id] = expectedValue.expected
        return results
      },
      {})

      return {
        name: this.shortDescription,
        description: this.details,
        output: outputVariables,
      }
    },
    testGenerationEndpoint() {
      return `/api/simulation/${this.store.simulationId}/openfisca-test`
    },
    resultToBase64() {
      return `data:text/octet-stream;charset=utf-8;base64,${window.btoa(
        this.result
      )}`
    },
    filename() {
      return `mes-aides-${this.store.simulationId}.yml`
    },
    sendMail() {
      return sendMontantsAttendus(this.store.simulationId)
    },
  },
  mounted() {
    this.getContributions()
  },
  methods: {
    add() {
      this.selection = [].concat(...this.selection).concat({ id: null })
    },
    trackMontantAttendu(type) {
      this.$matomo?.trackEvent("Montant attendu", type, this.$route.path)
    },
    remove(index) {
      const next = this.selection.slice()
      next.splice(index, 1)
      this.selection = next
    },
    getTitle(item) {
      return this.benefitKeyed[item.id].label
    },
    getActual(item) {
      //Todo : Retirer cette ligne lorsque l'on pourra accéder aux résultats des contributions.
      if (!this.resultats[item.id]) return 0
      return this.resultats[item.id].montant
    },
    getSuggestionPayload(content) {
      return {
        title: this.testMetadata.name,
        body: this.testMetadata.description,
        content,
      }
    },
    async fetchBenefit(fileAttribute) {
      const benefit = await getGithubPRFiles(fileAttribute)
      const institution = this.institutions[benefit.institution]
      if (institution) {
        benefit.institution = Object.assign({}, institution)
        this.benefits.push(benefit)
        this.benefitKeyed[benefit.id] = benefit
      }
    },
    copyToClipboard() {
      this.$refs["aj-textarea-results"].select()
      document.execCommand("copy")
    },
    async getContributions() {
      await fetchContributions().then((contributions) => {
        const benefits = contributions.reduce(
          (acc, contribution) =>
            reduceContributions(acc, contribution, "benefits"),
          []
        )
        if (contributions) {
          const benefitsPromises = []
          benefits.forEach((benefit) => {
            benefitsPromises.push(this.fetchBenefit(benefit))
          })
          Promise.all(benefitsPromises).then(() => {
            this.benefits.sort((a, b) => {
              return a.label.localeCompare(b.label)
            })
          })
        }
      })
    },
    submit() {
      this.message = null
      if (this.submitting) {
        return
      }

      if (!this.consentGiven) {
        this.showConsentNotice = true
        return
      }
      this.showConsentNotice = false

      if (!this.shortDescription) {
        this.message =
          "Vous devez indiquer une courte description. Elle doit permettre de comprendre la règle métier testée."
        return
      }

      if (!this.details) {
        this.message =
          "Vous devez apporter des détails. Ils ajoutent du contexte et facilitent la compréhension et la résolution du problème si nécessaire."
        return
      }

      if (!this.expectedResults.length) {
        this.message = "Vous devez indiquer au moins une prestation."
        return
      }

      this.submitting = true
      axios
        .post(this.testGenerationEndpoint, this.testMetadata)
        .then((response) => this.getSuggestionPayload(response.data))
        .then((payload) => {
          this.result = payload.content
        })
        .finally(() => {
          this.submitting = false
          this.trackMontantAttendu("Sauvegarde des données")
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.aj-resultats-attendus {
  select {
    max-width: 100%;
  }

  .inline {
    display: block;
  }

  .button {
    margin-top: 0.85em;
  }

  bold {
    font-weight: bold;
  }
}
</style>
