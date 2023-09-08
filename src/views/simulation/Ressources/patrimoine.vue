<template>
  <form>
    <fieldset class="fr-fieldset">
      <legend
        class="fr-text--lead fr-text--bold"
        data-testid="immobilier-title"
      >
        <span class="fr-icon-home-4-line fr-mr-2w" aria-hidden="true"></span>
        <span>Immobilier</span>
      </legend>

      <div class="fr-fieldset__content">
        <YesNoQuestion
          id="patrimoine-terrain-non-loues"
          v-model="hasTerrainsNonLoues"
        >
          Avez-vous des terrains <b>non loués</b> ?
        </YesNoQuestion>

        <div v-if="hasTerrainsNonLoues" class="form__group fr-my-4w">
          <div>
            <label
              for="valeur_terrains_non_loues"
              class="fr-col-12 fr-col-xs-5 fr-col-lg-5 fr-mb-2w"
            >
              Valeur <b>patrimoniale</b> totale de vos terrains <b>non loués</b>
              <InputNumber
                id="valeur_terrains_non_loues"
                v-model="demandeur.valeur_terrains_non_loues[periodKey]"
                class=""
              />
            </label>
          </div>

          <div class="fr-mt-2w">
            <label
              for="valeur_locative_terrains_non_loues"
              class="fr-col-12 fr-col-xs-5 fr-col-lg-5 fr-mb-2w"
            >
              Valeur <b>locative</b> totale de vos terrains <b>non loués</b>
              <InputNumber
                id="valeur_locative_terrains_non_loues"
                v-model="
                  demandeur.valeur_locative_terrains_non_loues[periodKey]
                "
              />
            </label>
            <p class="fr-hint-text">
              Pour trouver ces valeurs, consultez votre avis d'imposition de
              taxe d'habitation ou de taxe foncière.
            </p>
          </div>
        </div>

        <YesNoQuestion
          id="patrimoine-immeubles-non-loues"
          v-model="hasBatisNonLoues"
          class="form__group fr-my-4w"
        >
          Avez-vous des appartements/immeubles <b>non loués</b> ?
          <template #help>
            <p class="fr-hint-text">
              Sauf résidence principale et bâtiments de l'exploitation agricole.
            </p>
          </template>
        </YesNoQuestion>

        <div v-if="hasBatisNonLoues" class="fr-my-4w">
          <div>
            <label for="valeur_immo_non_loue" class="fr-label">
              Valeur <b>patrimoniale</b> de vos appartements/immeubles
              <b>non loués</b>
              <InputNumber
                id="valeur_immo_non_loue"
                v-model="demandeur.valeur_immo_non_loue[periodKey]"
              />
            </label>
          </div>

          <div class="fr-mt-2w">
            <label for="valeur_locative_immo_non_loue" class="fr-label">
              Valeur <b>locative</b> totale de vos appartements/immeubles
              <b>non loués</b>
              <InputNumber
                id="valeur_locative_immo_non_loue"
                v-model="demandeur.valeur_locative_immo_non_loue[periodKey]"
              />
            </label>

            <p class="fr-hint-text">
              Pour la trouver, consultez votre avis d'imposition de taxe
              d'habitation ou de taxe foncière.
            </p>
          </div>

          <div class="fr-mt-2w">
            <label
              v-if="hasBiensLoues"
              for="valeur_patrimoine_loue"
              class="fr-label fr-mt-2w"
              >Valeur <b>patrimoniale</b> de vos bien <b> loués</b>
              <InputNumber
                id="valeur_patrimoine_loue"
                v-model="demandeur.valeur_patrimoine_loue[periodKey]"
              />
            </label>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="fr-fieldset">
      <legend
        class="fr-text--lead fr-text--bold"
        data-testid="immobilier-title"
      >
        <span
          class="fr-icon-money-euro-box-line fr-mr-2w"
          aria-hidden="true"
        ></span>
        <span>Épargne</span>
      </legend>
      <div class="fr-fieldset__content">
        <div>
          <label for="livret_a" class="fr-label">
            Livret A <span class="help-block">Aussi appelé Livret bleu.</span>
            <InputNumber
              id="livret_a"
              v-model="demandeur.livret_a[periodKey]"
            />
          </label>
        </div>

        <div class="fr-mt-2w">
          <label for="epargne_revenus_non_imposables" class="fr-label">
            Total des autres produits d'épargne produisant des revenus
            <b>non imposables</b>
            <InputNumber
              id="epargne_revenus_non_imposables"
              v-model="demandeur.epargne_revenus_non_imposables[periodKey]"
            />
            <span class="fr-hint-text">
              Assurance vie,
              <abbr title="Compte d'épargne-logement">CEL</abbr>,
              <abbr title="Livret de développement durable">LDD</abbr>,
              <abbr title="Livret d'épargne populaire">LEP</abbr>, Livret jeune,
              <abbr title="Plan d'épargne en actions">PEA</abbr>, plan d'épargne
              d'entreprise, <abbr title="Plan d'épargne logement">PEL</abbr>,
              <abbr title="Plan d'épargne populaire">PEP</abbr>.
            </span>
          </label>
        </div>

        <div class="fr-mt-2w">
          <label for="epargne_revenus_imposables" class="fr-label">
            Total de l'épargne produisant des revenus <b>imposables</b>
            <InputNumber
              id="epargne_revenus_imposables"
              v-model="demandeur.epargne_revenus_imposables[periodKey]"
            />
            <span class="fr-hint-text">
              Actions, comptes à terme,
              <abbr title="Fonds communs de placement">FCP</abbr>, obligations,
              parts sociales,
              <abbr title="Société d'Investissement à CApital Variable"
                >SICAV</abbr
              >, etc.
            </span>
          </label>
        </div>
      </div>
    </fieldset>

    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script lang="ts">
import { patrimoineTypes } from "@lib/resources.js"
import YesNoQuestion from "@/components/yes-no-question.vue"
import InputNumber from "@/components/input-number.vue"
import ActionButtons from "@/components/action-buttons.vue"
import { useStore } from "@/stores/index.js"
import { Patrimoine } from "@lib/types/store.d.js"
import { PatrimoineCategory } from "@lib/enums/patrimoine.js"

const mapping = {
  hasTerrainsNonLoues: {
    sources: [
      PatrimoineCategory.ValeurTerrainsNonLoues,
      PatrimoineCategory.ValeurLocativeTerrainsNonLoues,
    ],
  },
  hasBatisNonLoues: {
    sources: [
      PatrimoineCategory.ValeurImmoNonLoue,
      PatrimoineCategory.ValeurLocativeImmoNonLoue,
    ],
  },
}

export default {
  name: "RessourcesPatrimoine",
  components: {
    InputNumber,
    YesNoQuestion,
    ActionButtons,
  },
  setup() {
    return { store: useStore() }
  },
  data() {
    const situation = this.store.situation
    let periodKey = "month:2019-01:120"
    let demandeur = Object.assign({}, situation.demandeur)
    let individus = this.store.peopleParentsFirst

    patrimoineTypes.forEach(function (p) {
      const patrimoinePropertyName = p.id
      demandeur[patrimoinePropertyName] = Object.assign(
        {},
        demandeur[patrimoinePropertyName]
      )
      demandeur[patrimoinePropertyName][periodKey] =
        demandeur[patrimoinePropertyName][periodKey] || 0
    })

    let locals = {
      hasBiensLoues: individus.some((individu) => individu.revenus_locatifs),
      hasEpargneAuxRevenusImposables: individus.some(
        (individu) => individu.revenus_capital
      ),
    }

    let localKeys = Object.keys(mapping)
    localKeys.forEach(function (keyName) {
      locals[keyName] = false
      mapping[keyName].sources.forEach(function (attributeName) {
        locals[keyName] = Boolean(
          locals[keyName] || demandeur[attributeName][periodKey]
        )
      })
    })

    return {
      demandeur,
      hasTerrainsNonLoues: true,
      ...locals,
      periodKey,
    }
  },
  watch: {
    hasTerrainsNonLoues: {
      handler(value) {
        if (!value) {
          this.demandeur.valeur_terrains_non_loues = {}
          this.demandeur.valeur_locative_terrains_non_loues = {}
          this.store.setPatrimoine(undefined)
        }
      },
    },
    hasBatisNonLoues: {
      handler(value) {
        if (!value) {
          this.demandeur.valeur_immo_non_loue = {}
          this.demandeur.valeur_locative_immo_non_loue = {}
          this.store.setPatrimoine(undefined)
        }
      },
    },
  },
  methods: {
    onSubmit() {
      const values: Patrimoine = patrimoineTypes.reduce(
        (patrimoines, patrimoineType) => ({
          ...patrimoines,
          [patrimoineType.id]:
            this.demandeur[patrimoineType.id][this.periodKey],
        }),
        {}
      )

      this.store.setPatrimoine(values)
      this.$router.push("/simulation/resultats")
    },
  },
}
</script>
