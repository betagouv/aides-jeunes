<template>
  <article class="fr-article">
    <h1>Toutes les aides</h1>
    <p>Total: {{ benefitsCount }} aides</p>
    <div class="fr-form-group">
      <div class="fr-container fr-px-0">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <label class="fr-label" for="cp-input"
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
      <p>
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
        <p
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

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import institutionsBenefits from "generator:institutions"
import CommuneMethods from "@/lib/commune.js"
import { Commune } from "@lib/types/commune.d.js"

const zipCode = ref("")
const selectedCommune = ref<Commune | null>()
const benefitsCount = ref(process.env.VITE_BENEFIT_COUNT)
const types = {
  national: "Aides nationales",
  region: "Aides régionales",
  departement: "Aides départementales",
  epci: "EPCI (Métropole, inter-communauté, etc.)",
  caf: "CAF Locales",
  msa: "MSA Locales",
  commune: "Aides communales",
  autre: "Autres aides",
}

const institutionsGroups = computed(() => {
  if (selectedCommune.value) {
    return {
      national: institutionsBenefits["national"],
      region: institutionsBenefits["region"].filter(
        (region) => region.location === selectedCommune.value!.region
      ),
      departement: institutionsBenefits["departement"].filter(
        (departement) =>
          departement.location === selectedCommune.value!.departement
      ),
      epci: institutionsBenefits["epci"].filter((epci) =>
        epci.location?.includes(selectedCommune.value!.code)
      ),
      commune: institutionsBenefits["commune"].filter(
        (commune) => commune.location === selectedCommune.value!.code
      ),
      caf: institutionsBenefits["caf"].filter((caf) =>
        caf.location?.includes(selectedCommune.value!.departement)
      ),
      msa: institutionsBenefits["msa"].filter((msa) =>
        msa.location?.includes(selectedCommune.value!.departement)
      ),
    }
  }
  return institutionsBenefits
})
async function computeDataSelected() {
  if (zipCode.value.match(/^[0-9]{5}$/)) {
    const res = await CommuneMethods.get(zipCode.value)
    selectedCommune.value = res[0]
  } else {
    selectedCommune.value = null
  }
}
watch(zipCode, (newZipCode: string) => {
  if ([0, 5].includes(newZipCode.length)) {
    computeDataSelected()
  }
})
function countFilteredBenefits(): number {
  return Object.keys(institutionsGroups.value).reduce((acc, type) => {
    return (
      acc +
      institutionsGroups.value[type].reduce(
        (benefitsCount, institution) =>
          benefitsCount + institution.benefits.length,
        0
      )
    )
  }, 0)
}
</script>
