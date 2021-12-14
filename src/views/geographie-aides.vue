<template>
  <article class="text container aj-text-container">
    <h1>Répartition géographique des aides</h1>

    <h2>Général</h2>
    <p class="total-element">Total: {{ benefits.length }} aides</p>

    <div v-for="(level, key) in institutionsGroupByLevel" :key="key">
      <h2>{{ level.title }}</h2>
      <p class="total-element">
        Nombre d'aides : {{ level.benefitsLength }}
        <br />
        Nombre d'institutions :
        {{ level.institutions.length }}
      </p>

      <div v-for="institution in level.institutions" :key="institution.id">
        <h3 class="aj-question">{{ institution.label }}</h3>
        <p class="total-element">{{ institution.benefits.length }} aides :</p>
        <ul>
          <li v-for="benefit in institution.benefits" :key="benefit.id">
            {{ benefit.label }}
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script>
import Institution from "@/lib/Institution"

const LEVELS = {
  national: "Aides nationales",
  regional: "Aides régionales",
  departemental: "Aides départementales",
  communal: "Aides communales",
}

export default {
  name: "geographie-aides",
  computed: {
    benefits() {
      return Institution.benefits.all.filter((benefit) => !benefit.private)
    },
    institutionsGroupByLevel() {
      const institutionsMap = Institution.benefits.institutionsMap
      const result = Object.entries(LEVELS).reduce((accum, [level, title]) => {
        const benefits = this.benefits.filter(
          (benefit) => benefit.institution.level === level
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

        accum[level] = {
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
