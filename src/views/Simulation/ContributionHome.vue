<template>
  <div class="aj-main-container aj-resultats-attendus">
    <form @submit.prevent="submit">
      <div>
        <p> Bienvenue dans le mode contribution ! </p>
        <fieldset class="form__group">
          <legend v-if="selection.id"
            ><h2>{{ selection.id }}</h2>
          </legend>
          <div class="form__group">
            <label for="de"
              >Quelle est la prestation pour laquelle vous souhaitez contribuer
              ? &nbsp;?</label
            >
            <select v-model="selection">
              <option
                v-for="(benefit, bIndex) in benefits"
                v-bind:key="bIndex"
                v-bind:value="benefit"
                >{{ benefit.label }}</option
              >
            </select>
          </div>

          <div class="form__group" v-if="selection">
            <label for="expected"
              >Quelle est la valeur à laquelle vous vous attendiez&nbsp;?</label
            >
            <input id="expected" v-model="selection.expected" />
          </div>
        </fieldset>

        <label class="form__group"
          >Description détaillée
          <textarea
            rows="9"
            v-bind:placeholder="detailed"
            v-model="description"
          ></textarea>
        </label>
        {{ message }}
        <button
          v-bind:class="`button large ${this.submitting ? 'secondary' : ''}`"
          >Commencer le mode contribution</button
        >
      </div>
    </form>
  </div>
</template>

<script>
import sortBy from "lodash/sortBy"
import Institution from "@/lib/Institution"
import ResultatsMixin from "@/mixins/Resultats"
import {
  fetchContributions,
  reduceContributions,
  getGithubPRFiles,
} from "@/../backend/lib/mes-aides/contributions"

export default {
  name: "attendu",
  mixins: [ResultatsMixin],
  data: function () {
    let benefitKeyed = {}
    let benefits = []
    Institution.forEachBenefit((benefit, benefitId) => {
      const b = Object.assign({ id: benefitId }, benefit)
      benefits.push(b)
    })
    benefits = sortBy(benefits, "label")
    return {
      benefits,
      benefitKeyed,
      detailed: `Le RSA doit prend en compte les aides au logement. Un 'forfait logement' doit être appliqué cf. l'article R262-9 du Code de l'action sociale et des familles.
- https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000031694445&cidTexte=LEGITEXT000006074069&dateTexte=20171222&fastPos=2&fastReqId=1534790830&oldAction=rechCodeArticle`,
      description: null,
      error: null,
      message: null,
      selection: {},
      submitting: false,
    }
  },
  methods: {
    async fetchBenefit(fileAttribute) {
      return await getGithubPRFiles(fileAttribute)
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
            this.benefits = sortBy(this.benefits, "label")
          })
        }
      })
    },
    submit: function () {
      this.message = null
      if (this.submitting) {
        return
      }

      if (!this.description) {
        this.message =
          "Vous devez apporter des détails. Ils ajoutent du contexte et facilitent la compréhension et la résolution du problème si nécessaire."
        return
      }

      if (!this.selection.id && this.selection.expected !== undefined) {
        this.message = "Vous devez indiquer au moins une aide."
        return
      }
      this.submitting = true
      const _details = {
        name: this.selection.id,
        description: this.selection.description,
        output: {
          [this.selection.id]: this.selection.expected,
        },
        absolute_error_margin: 0.1,
      }

      this.$store.dispatch("clear")
      this.$store.dispatch("setContribution", true)
      this.$store.dispatch("saveContribution", { _details })
      this.$router.push("/simulation")
    },
  },
  mounted() {
    this.getContributions()
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
