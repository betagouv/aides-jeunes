<template>
  <article class="text container aj-text-container">
    <h1>Toutes les aides</h1>
    <p class="total-element">Total: {{ benefitsCount }} aides</p>
    <div class="cp-filter-block">
      <p class="cp-filter-label">Filtrer par code postal :</p>
      <input
        v-model="zipCode"
        type="text"
        class="cp-filter-input"
        @keyup.enter="computeDataSelected"
      />
    </div>

    <h6 v-if="selectedCommune" class="cp-filter-benefit-number"
      >{{ countFilteredBenefits() }}
      aides disponibles pour la commune de
      {{ selectedCommune.nom }}
    </h6>
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
          >
            {{ institution.label }}
          </router-link>
        </h3>
        <p class="total-element">{{ institution.benefits.length }} aides :</p>
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
import Commune from "@/lib/commune"

const TYPES = {
  national: "Aides nationales",
  region: "Aides régionales",
  departement: "Aides départementales",
  epci: "EPCI (Métropole, inter-communauté, etc.)",
  caf: "CAF Locales",
  commune: "Aides communales",
  autre: "Autres aides",
}

export default {
  data() {
    return {
      zipCode: "" as string,
      selectedCommune: null as typeof Commune,
      benefitsIncluded: [] as Array<any>,
      benefitsCount: process.env.VITE_BENEFIT_COUNT as string,
      types: TYPES,
    }
  },
  computed: {
    benefits(): Array<any> {
      return [] //Benefits.all.filter((benefit) => !benefit.private)
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
            epci?.location.includes(this.selectedCommune.code)
          ),
          commune: institutionsBenefits["commune"].filter(
            (commune) => commune?.location == this.selectedCommune?.code
          ),
          caf: institutionsBenefits["caf"].filter(
            (caf) => caf.location == this.selectedCommune?.departement
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
        console.log(res[0])
        this.selectedCommune = res[0]
      } else {
        this.selectedCommune = null
      }
    },
    countFilteredBenefits(): Number {
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

<style>
.total-element {
  color: var(--darker-grey);
  font-weight: 700;
}
.cp-filter-block {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.cp-filter-input {
  width: 6rem;
  text-align: center;
  height: 1.7rem;
}
.cp-filter-benefit-number {
  margin: 0.1rem 0 1rem 0;
}
</style>
