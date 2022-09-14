<template>
  <article class="text container aj-text-container">
    <h1>Toutes les aides</h1>
    <p class="total-element">Total: {{ benefits.length }} aides</p>
    <div class="cp-filter-block">
      <div class="cp-filter-label"> Filtrer par code postal :</div>
      <input v-model="zipCode" type="text" class="cp-filter-input" />
    </div>

    <div v-for="(type, key) in institutionsGroupByType" :key="key">
      <h2 :id="`liste_${key}`">{{ type.title }}</h2>
      <p class="total-element">
        Nombre d'aides : {{ type.benefitsLength }}
        <br />
        Nombre d'institutions :
        {{ type.institutions.length }}
      </p>

      <div v-for="institution in type.institutions" :key="institution.id">
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

<script>
import Institution from "@/lib/institution"

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
  name: "GeographieAides",
  data() {
    return {
      zipCode: "",
    }
  },
  computed: {
    benefits() {
      return Institution.benefits.all.filter((benefit) => !benefit.private)
    },
    institutionsGroupByType() {
      const institutionsMap = Institution.benefits.institutionsMap
      const result = Object.entries(TYPES).reduce((accum, [type, title]) => {
        const benefits = this.benefits.filter(
          (benefit) => benefit.institution.type === type
        )
        benefits.sort((a, b) => {
          return a.label.localeCompare(b.label)
        })

        const institutions = benefits.reduce((accum, benefit) => {
          const institution = accum[benefit.institution.slug] || {
            ...institutionsMap[benefit.institution.slug],
            benefits: [],
          }
          institution.benefits.push(benefit)
          accum[institution.slug] = institution
          return accum
        }, {})

        accum[type] = {
          title,
          institutions: Object.values(institutions),
          benefitsLength: benefits.length,
        }
        return accum
      }, {})

      return result
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
  margin: 1% 0 2% 0;
}
.cp-filter-label {
  margin-right: 0.5%;
}
.cp-filter-input {
  width: 6em;
  text-align: center;
  height: 1.7em;
}
</style>
