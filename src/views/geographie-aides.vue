<template>
  <article class="text container aj-text-container">
    <h1>Répartition géographique des aides</h1>

    <h2>Général</h2>
    <p class="total-element">Total: {{ benefits.length }} aides</p>

    <div v-for="(type, key) in institutionsGroupByType" :key="key">
      <h2>{{ type.title }}</h2>
      <p class="total-element">
        Nombre d'aides : {{ type.benefitsLength }}
        <br />
        Nombre d'institutions :
        {{ type.institutions.length }}
      </p>

      <div v-for="institution in type.institutions" :key="institution.id">
        <h3 class="aj-question">{{ institution.label }}</h3>
        <p class="total-element">{{ institution.benefits.length }} aides :</p>
        <ul>
          <li v-for="benefit in institution.benefits" :key="benefit.id">
            {{ $filters.capitalize(benefit.label) }}
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script>
import Institution from "@/lib/Institution"

const TYPES = {
  national: "Aides nationales",
  regional: "Aides régionales",
  departemental: "Aides départementales",
  communal: "Aides communales",
}

export default {
  name: "GeographieAides",
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

        const institutions = benefits.reduce((accum, benefit) => {
          const institution = accum[benefit.institution.id] || {
            ...institutionsMap[benefit.institution.id],
            benefits: [],
          }
          institution.benefits.push(benefit)
          accum[institution.id] = institution

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
  color: var(--dark-grey);
  font-weight: 700;
}
</style>
