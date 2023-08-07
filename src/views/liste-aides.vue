<template>
  <article class="fr-article">
    <h1>Toutes les aides</h1>
    <p class="total-element">Total: {{ benefitsCount }} aides</p>
    <div class="fr-form-group">
      <div class="fr-container fr-px-0">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <label class="cp-filter-label" for="cp-input"
              >Filtrer par code postal :</label
            >
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <input
              id="cp-input"
              v-model="zipCode"
              type="text"
              class="fr-input"
              @keyup.enter="computeDataSelected"
            />
          </div>
          <div v-if="selectedCommune" class="fr-col-12">
            <p class="fr-text--bold fr-mt-2w"
              >{{ countFilteredBenefits() }} aides disponibles pour la commune
              de {{ selectedCommune.nom }}</p
            >
          </div>
        </div>
      </div>
    </div>

    <div v-for="(institutions, type) in institutionsGroups" :key="type">
      <h2 :id="`liste_${type}`">{{ types[type] }}</h2>
      <p class="total-element">
        Nombre d'aides :
        {{
          institutions.reduce(
            (acc, institution) => acc + institution.benefits.length,
            0
          )
        }}
        <br />
        Nombre d'institutions :
        {{ institutions.length }}
      </p>
      <div v-for="institution in institutions" :key="institution.id">
        <h3 :id="institution.id" class="aj-question">
          <router-link
            :title="`Lien vers la liste des aides de l'institution ${institution.label}`"
            :to="{
              path: `/aides`,
              hash: `#${institution.id}`,
            }"
            aria-current="none"
          >
            {{ institution.label }}
          </router-link>
        </h3>
        <p class="total-element"
          >{{
            institution.benefits.length > 1
              ? institution.benefits.length + " aides :"
              : institution.benefits.length + " aide :"
          }}
        </p>
        <ul>
          <li v-for="benefit in institution.benefits" :key="benefit.id">
            <router-link
              :to="{ name: 'aide', params: { benefitId: benefit.id } }"
            >
              {{ $filters.capitalize(benefit.label) }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import institutionsBenefits from "generator:institutions"
import Commune from "@/lib/commune.js"
import { CommuneInterface } from "@lib/types/commune.d.js"

const TYPES = {
  national: "Aides nationales",
  region: "Aides régionales",
  departement: "Aides départementales",
  epci: "EPCI (Métropole, inter-communauté, etc.)",
  caf: "CAF Locales",
  msa: "MSA Locales",
  commune: "Aides communales",
  autre: "Autres aides",
}

export default {
  data() {
    return {
      zipCode: "" as string,
      selectedCommune: null as CommuneInterface | null,
      benefitsIncluded: [] as Array<any>,
      benefitsCount: process.env.VITE_BENEFIT_COUNT as string,
      types: TYPES,
    }
  },
  computed: {
    benefits(): Array<any> {
      return []
    },
    institutionsGroups(): any {
      if (this.selectedCommune) {
        return {
          national: institutionsBenefits["national"],
          region: institutionsBenefits["region"].filter(
            (region) => region.location == this.selectedCommune?.region
          ),
          departement: institutionsBenefits["departement"].filter(
            (departement) =>
              departement.location == this.selectedCommune?.departement
          ),
          epci: institutionsBenefits["epci"].filter((epci) =>
            epci?.location.includes(this.selectedCommune?.code)
          ),
          commune: institutionsBenefits["commune"].filter(
            (commune) => commune?.location == this.selectedCommune?.code
          ),
          caf: institutionsBenefits["caf"].filter(
            (caf) =>
              caf.location &&
              caf.location.includes(this.selectedCommune?.departement)
          ),
          msa: institutionsBenefits["msa"].filter(
            (msa) =>
              msa.location &&
              msa.location.includes(this.selectedCommune?.departement)
          ),
        }
      }
      return institutionsBenefits
    },
  },
  watch: {
    zipCode: function (newZipCode): void {
      if ([0, 5].includes(newZipCode.length)) {
        this.computeDataSelected()
      }
    },
  },
  methods: {
    async computeDataSelected(): Promise<void> {
      if (this.zipCode.match(/^[0-9]{5}$/)) {
        const res = await Commune.get(this.zipCode)
        this.selectedCommune = res[0]
      } else {
        this.selectedCommune = null
      }
    },
    countFilteredBenefits(): number {
      return Object.keys(this.institutionsGroups).reduce((acc, type) => {
        return (
          acc +
          this.institutionsGroups[type].reduce(
            (benefitsCount, institution) =>
              benefitsCount + institution.benefits.length,
            0
          )
        )
      }, 0)
    },
  },
}
</script>
