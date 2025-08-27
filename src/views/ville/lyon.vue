<template>
  <article class="fr-article">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <h1
          >💰 Aides pour les jeunes à Lyon et dans la région
          Auvergne-Rhône-Alpes</h1
        >
        <p class="fr-text--lead">
          Découvrez toutes les aides financières disponibles pour les jeunes
          lyonnais : logement, études, transport, emploi et bien plus encore.
        </p>
      </div>
    </div>

    <div class="fr-mb-4w">
      <BackButton
        size="small"
        class="fr-mb-2w"
        as-link
        to="/"
        aria-label="Retour à la page d'accueil"
      >
        Retour à l'accueil
      </BackButton>
    </div>

    <div v-for="(institutions, type) in institutionsGroups" :key="String(type)">
      <h2 :id="`liste_${String(type)}`">{{ types[type] }}</h2>
      <p>
        Nombre d'aides :
        {{
          Array.isArray(institutions)
            ? institutions.reduce(
                (acc, institution) => acc + institution.benefits.length,
                0,
              )
            : 0
        }}
        <br />
        Nombre d'institutions :
        {{ Array.isArray(institutions) ? institutions.length : 0 }}
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
              {{ capitalize(benefit.label) }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import BackButton from "@/components/buttons/back-button.vue"
import CommuneMethods from "@/lib/commune"
import { computed, ref, onMounted } from "vue"
import institutionsBenefits from "generator:institutions"
import { capitalize } from "@lib/utils"
import { Commune } from "@lib/types/commune"

const selectedCommune = ref<Commune | null>(null)

const types = {
  europeen: "Aides européeennes",
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
  if (!selectedCommune.value) {
    return {}
  }

  return {
    commune: institutionsBenefits["commune"].filter(
      (commune) => commune.location === selectedCommune.value!.code,
    ),
    departement: institutionsBenefits["departement"].filter(
      (departement) =>
        departement.location === selectedCommune.value!.departement,
    ),
    region: institutionsBenefits["region"].filter(
      (region) => region.location === selectedCommune.value!.region,
    ),
    national: institutionsBenefits["national"],
    epci: institutionsBenefits["epci"].filter((epci) =>
      epci.location?.includes(selectedCommune.value!.code),
    ),
    caf: institutionsBenefits["caf"].filter((caf) =>
      caf.location?.includes(selectedCommune.value!.departement),
    ),
  }
})

onMounted(async () => {
  const res = await CommuneMethods.get("69001")
  selectedCommune.value = res[0]
})
</script>
