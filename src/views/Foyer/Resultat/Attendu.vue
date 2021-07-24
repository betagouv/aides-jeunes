<template>
  <div class="aj-main-container aj-resultats-attendus">
    <form @submit.prevent="submit">
      <router-link
        :to="{ name: 'resultats' }"
        tag="button"
        class="aj-etablissements-back-button button outline small with-icon"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z"
            fill="#030F8F"
          />
        </svg>
        Retour aux résultats
      </router-link>
      <div v-if="!result">
        <p>
          Ce formulaire permet aux personnes ayant une expertise dans les
          prestations sociales de nous aider à améliorer le simulateur.
        </p>
        <p>Plusieurs situations sont possibles&nbsp;:</p>
        <ul>
          <li
            >vous souhaitez <strong>confirmer</strong> que le résultat obtenu
            est correct ou</li
          >
          <li
            >vous souhaitez indiquer que résultat obtenu est
            <strong>incorrect</strong>.</li
          >
        </ul>
        <p>
          Dans tous les cas, il est important d'expliciter les intentions
          derrière votre validation. En général, il s'agit d'indiquer
          <strong>la règle métier</strong>.
        </p>

        <fieldset
          v-for="(item, index) in selection"
          v-bind:key="index"
          class="form__group"
        >
          <legend v-if="item.ref"
            ><h2>{{ getTitle(item.ref) }}</h2></legend
          >
          <div class="form__group">
            <label for="de"
              >Quelle est la prestation pour laquelle vous connaissez le
              résultat&nbsp;?</label
            >
            <select v-model="item.ref">
              <option
                v-for="(benefit, bIndex) in benefits"
                v-bind:key="bIndex"
                v-bind:value="benefit"
                >{{ benefit.label }}</option
              >
            </select>
          </div>

          <div class="form__group" v-if="item.ref">
            <label for="de">La valeur obtenue</label>
            <input disabled v-bind:value="getActual(item.ref)" />
          </div>

          <div class="form__group" v-if="item.ref">
            <label for="expected"
              >Quelle est la valeur à laquelle vous vous attendiez&nbsp;?</label
            >
            <input id="expected" v-model="item.expected" />
          </div>
          <div>
            <button
              class="button small warning"
              v-on:click.prevent="remove(index)"
              >Supprimer cette prestation</button
            >
          </div>
        </fieldset>

        <button class="form__group button secondary" v-on:click.prevent="add"
          >Ajouter une autre prestation pour laquelle vous connaissez le
          résultat</button
        >

        <label class="form__group"
          >Description courte
          <input
            placeholder="Les AL ne sont pas prises en compte dans le RSA"
            v-model="shortDescription"
          />
        </label>

        <label class="form__group"
          >Description détaillée
          <textarea
            rows="9"
            v-bind:placeholder="detailed"
            v-model="details"
          ></textarea>
        </label>

        <label class="form__group">
          <input type="checkbox" v-model="consentGiven" />
          J'accepte que les données de cette simulation soient visibles en
          ligne. Si les informations correspondent à une situation réelle, vous
          devriez
          <router-link to="/foyer/recapitulatif">les modifier</router-link>.
        </label>

        <p class="notification warning inline" v-if="showConsentNotice">
          Vous devez accepter la publication des données.
          <router-link to="/foyer/recapitulatif"
            >Vous pouvez les anonymiser si nécessaire.</router-link
          >
        </p>

        <p class="notification warning" v-if="message">
          {{ message }}
        </p>

        <p class="notification warning" v-if="error">
          {{ error }}
        </p>

        <div>
          <button
            v-bind:class="`button large ${this.submitting ? 'secondary' : ''}`"
            >Enregistrer</button
          >
          <span v-show="submitting"
            ><i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
            Enregistrement en cours…</span
          >
        </div>
      </div>

      <div v-if="result">
        <label class="form__group">
          <textarea
            ref="aj-textarea-results"
            class="aj-textarea-results"
            @click="copyToClipboard"
            readonly
            v-model="result"
            rows="9"
          />
        </label>

        <div>
          <p>
            Vous pouvez nous aider à améliorer le simulateur en nous envoyant
            par mail à
            <a v-mail="this.sendMail()">aides-jeunes@beta.gouv.fr</a> avec :
          </p>
          <ul>
            <li>
              le contenu du formulaire et en indiquant l'identifiant suivant :
              <span class="bold">{{ $store.state.situation._id }} .</span>
            </li>
            <li>en téléchargeant le fichier avec le bouton ci-dessous.</li>
          </ul>
        </div>
        <div>
          <a
            class="button large"
            @click="trackMontantAttendu('Téléchargement données')"
            :download="filename"
            :href="resultToBase64"
          >
            Télécharger le fichier de données
          </a>
        </div>
        <p>
          Vous pouvez aussi revenir à
          <router-link to="/simulation/resultats">
            la page de résultats.
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import filter from "lodash/filter"
import sortBy from "lodash/sortBy"

import axios from "axios"
import Institution from "@/lib/Institution"
import ResultatsMixin from "@/mixins/Resultats"
import { sendMontantsAttendus } from "@/plugins/mails"
import { capitalize } from "../../../lib/Utils"

export default {
  name: "attendu",
  mixins: [ResultatsMixin],
  data: function () {
    let benefitKeyed = {}
    let benefits = []
    Institution.forEachBenefit(
      (benefit, benefitId, provider, providerId, level) => {
        const b = Object.assign(
          { id: benefitId, provider: { ...provider, id: providerId }, level },
          benefit
        )
        benefit.label = capitalize(benefits.label)
        if (b.label === "Tarification solidaire transports") {
          b.label = `${b.label} - ${provider.label}`
        }
        benefits.push(b)
        benefitKeyed[b.id] = b
      }
    )
    benefits = sortBy(benefits, "label")
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
          prop: "droitsNonEligibles",
          status: "ineligible",
        },
        {
          prop: "droitsInjectes",
          status: "injected",
        },
      ]
      map.forEach((p) => {
        this.$store.state.calculs.resultats[p.prop].forEach((b) => {
          resultats[b.id] = Object.assign({ status: p.status }, b)
        })
      })
      return resultats
    },
    expectedResults() {
      return filter(this.selection, (i) => i.ref && i.expected !== null)
    },
    testMetadata: function () {
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
    testGenerationEndpoint: function () {
      return `api/situations/${this.$store.state.situation._id}/openfisca-test`
    },
    resultToBase64() {
      return `data:text/octet-stream;charset=utf-8;base64,${window.btoa(
        this.result
      )}`
    },
    filename() {
      return this.$store.state.situation._id + ".yml"
    },
    sendMail() {
      return sendMontantsAttendus(this.$store.state.situation._id)
    },
  },
  methods: {
    add: function () {
      this.selection = [].concat(...this.selection).concat({ id: null })
    },
    trackMontantAttendu(type) {
      this.$matomo &&
        this.$matomo.trackEvent("Montant attendu", type, this.$route.path)
    },
    remove: function (index) {
      const next = this.selection.slice()
      next.splice(index, 1)
      this.selection = next
    },
    getTitle: function (item) {
      return this.benefitKeyed[item.id].label
    },
    getBenefit: function (item) {
      return this.benefitKeyed[item.id]
    },
    getActual: function (item) {
      return this.resultats[item.id].montant
    },
    getSuggestionPayload(content) {
      return {
        title: this.testMetadata.name,
        body: this.testMetadata.description,
        content,
      }
    },
    copyToClipboard() {
      this.$refs["aj-textarea-results"].select()
      document.execCommand("copy")
    },
    submit: function () {
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

<style scoped lang="scss">
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
