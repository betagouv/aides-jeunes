<template>
  <form @submit.prevent="submit">
    <div v-if="!result">
      <p>
        Introduction détaillant l'intérêt de ce formulaire
      </p>
      <p>Plusieurs situations sont possibles&nbsp;:</p>
      <ul>
        <li>vous souhaitez <strong>confirmer</strong> que le résultat obtenu est correct ou</li>
        <li>vous souhaitez indiquer que résultat obtenu est <strong>incorrect</strong>.</li>
      </ul>
      <p>
        Dans tous les cas, il est important d'expliciter les intentions derrière votre validation. En général, il s'agit d'indiquer <strong>la règle métier</strong>.
      </p>

      <fieldset v-for="(item, index) in selection" v-bind:key="index" class="form__group">
        <legend v-if="item.ref"><h2>{{getTitle(item.ref)}}</h2></legend>
        <div class="form__group">
          <label for="de">Quelle est la prestation pour laquelle vous connaissez le résultat&nbsp;?</label>
          <select v-model="item.ref">
            <option v-for="(benefit, bIndex) in benefits" v-bind:key="bIndex" v-bind:value="benefit">{{benefit.label}}</option>
          </select>
        </div>

        <div class="form__group" v-if="item.ref">
          <label for="de">La valeur obtenue</label>
          <input disabled v-bind:value="getActual(item.ref)" />
        </div>

        <div class="form__group" v-if="item.ref">
          <label for="expected">Quelle est la valeur à laquelle vous vous attendiez&nbsp;?</label>
          <input id="expected" v-model="item.expected"/>
        </div>

        <button class="form__group button small warning" v-on:click.prevent="remove(index)">Supprimer cette prestation</button>
      </fieldset>

      <button class="form__group button secondary" v-on:click.prevent="add">Ajouter une autre prestation pour laquelle vous connaissez le résultat</button>

      <label class="form__group">Description courte
        <input
          placeholder="Les AL ne sont pas prises en compte dans le RSA"
          v-model="shortDescription"
        />
      </label>

      <label class="form__group">Description détaillée
        <textarea
          rows="9"
          v-bind:placeholder="detailed"
          v-model="details"
        ></textarea>
      </label>

      <label class="form__group">
        <input type="checkbox" v-model="consentGiven">
        J'accepte que les données de cette simulation soient visibles en ligne. Si les informations correspondent à une situation réelle, vous devriez <router-link to="/foyer/recapitulatif">les modifier</router-link>.
      </label>

      <p class="notification warning inline" v-if="showConsentNotice">
        Vous devez accepter la publication des données. <router-link to="/foyer/recapitulatif">Vous pouvez les anonymiser si nécessaire.</router-link>
      </p>

      <p class="notification warning" v-if="message">
        {{message}}
      </p>

      <p class="notification warning" v-if="error">
        {{error}}
      </p>

      <div>
        <button v-bind:class="`button large ${this.submitting ? 'secondary' : ''}`">Enregistrer</button>
        <span v-show="submitting"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Enregistrement en cours…</span>
      </div>
    </div>

    <div v-if="result">
      <p>
        Les informations saisies ont bien été enregistrées. Elles sont accessibles à
        <a
          target="_blank"
          rel="noopener"
          v-bind:href="result.data.html_url">
          la page suivante
        </a>.
      </p>

      <p>Vous pouvez aussi revenir à <router-link
          to="/foyer/resultat">
          la page de résultats
        </router-link>.</p>
    </div>
  </form>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import { forEach } from '@/../backend/lib/mes-aides'

export default {
  name: 'attendu',
  data: function() {
    let benefitKeyed = {}
    let benefits = []
    forEach((benefit, benefitId, provider, providerId, level) => {
      const b = Object.assign({id: benefitId, provider: {...provider, id: providerId}, level}, benefit)
      if (b.label === 'Tarification solidaire transports') {
        b.label = `${b.label} - ${provider.label}`
      }
      benefits.push(b)
      benefitKeyed[b.id] = b
    })
    benefits = _.sortBy(benefits, 'label')

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
      selection: [{ref: null, expected: null}],
      shortDescription: null,
      showConsentNotice: false,
      submitting: false
    }
  },
  computed: {
    resultats: function() {
      let resultats = {}
      const map = [{
        prop: 'droitsEligibles',
        status: 'eligible'
      }, {
        prop: 'droitsNonEligibles',
        status: 'ineligible'
      }, {
        prop: 'droitsInjectes',
        status: 'injected'
      }]
      map.forEach(p => {
        this.$store.state.calculs.resultats[p.prop].forEach(b => {
          resultats[b.id] = Object.assign({status: p.status}, b)
        })
      })
      return resultats
    },
    expectedResults: function() {
      return _.filter(this.selection, i => i.ref && i.expected !== null)
    },
    extensionAndRepository: function() {
      var extensions = _.chain(this.selection).map(i => i.ref)
          .filter(aid => aid && aid.level == 'partenairesLocaux')
          .map(aid => aid.provider.repository || aid.provider.id)
          .uniq()
          .value()

      if (! extensions.length) {
          return {
              repository: 'openfisca-france'
          }
      }

      if (extensions.length > 1) {
          var message = 'Vous avez spécifié des prestations de plusieurs extensions. Dans un test donné, vous ne pouvez spécifier que des prestations nationales et celle d‘une seule extension. Pour plus d‘information, contactez-nous.'
          return {
              error: message
          }
      }

      var dest = 'openfisca-' + extensions[0]
      return {
          extension: dest,
          repository: dest,
      }
    },
    testMetadata: function() {
      var outputVariables = this.expectedResults.reduce(function(results, expectedValue) {
        results[expectedValue.ref.id] = expectedValue.expected
        return results
      }, {})

      return {
        extension: this.extensionAndRepository.extension,
        name: this.shortDescription,
        description: this.details,
        output: outputVariables
      }
    },
    testGenerationEndpoint: function() {
      return `api/situations/${this.$store.state.situation._id}/openfisca-test`
    },
    suggestionEndpoint: function() {
      return `https://ludwig.incubateur.net/api/repository/github/openfisca/${this.extensionAndRepository.repository}/suggest`
    },
  },
  methods: {
    add: function() {
      this.selection = [].concat(...this.selection).concat({id: null})
    },
    remove: function(index) {
      const next = this.selection.slice()
      next.splice(index, 1)
      this.selection = next
    },
    getTitle: function(item) {
      return this.benefitKeyed[item.id].label
    },
    getBenefit: function(item) {
      return this.benefitKeyed[item.id]
    },
    getActual: function(item) {
      return this.resultats[item.id].montant
    },
    getSuggestionPayload(content) {
      return {
        title: this.testMetadata.name,
        body: this.testMetadata.description,
        content
      }
    },
    submit: function() {
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
        this.message = 'Vous devez indiquer une courte description. Elle doit permettre de comprendre la règle métier testée.'
        return
      }

      if (!this.details) {
        this.message = 'Vous devez apporter des détails. Ils ajoutent du contexte et facilitent la compréhension et la résolution du problème si nécessaire.'
        return
      }

      if (!this.expectedResults.length) {
        this.message = 'Vous devez indiquer au moins une prestation.'
        return
      }

      this.submitting = true
      axios.post(this.testGenerationEndpoint, this.testMetadata)
        .then(response => this.getSuggestionPayload(response.data))
        .then(payload => axios.post(this.suggestionEndpoint, payload))
        .then(response => this.result = response.data)
        .catch(error => this.error = (error.response && error.response.data && error.response.data.error) || error.message)
        .finally(() => this.submitting = false)
    },
  }
}
</script>

<style scoped lang="scss">

fieldset {
  border: black solid 1px;
  padding: 1em;
}

select {
  max-width: 100%;
}

textarea {
  resize: block;
}

.inline {
  display: block;
}

</style>
