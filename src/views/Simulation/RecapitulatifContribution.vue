<template>
  <div>
    <div> Récapitulatif contribution </div>

    <div>
      <table>
        <thead>
          <tr>
            <th>Variable Openfisca</th>
            <th>Valeur en lien</th>
            <th>Modifier</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(resultat, index) in resultats">
            <tr :key="index">
              <td>{{ resultat.openfiscaVariable }}</td>
              <td>{{ resultat.value }}</td>
              <td><router-link :to="resultat.path">Modifier</router-link></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Individu from "@/lib/Individu"

export default {
  name: "SimulationRecapitulatifContribution",
  components: {},
  computed: {
    contribution() {
      return this.$store.state.contribution
    },
    situation() {
      return this.$store.state.situation
    },
    resultats() {
      const steps = this.$store.getters.getAllSteps

      return Object.entries(this.contribution).reduce(
        (accum, [entityName, entity]) => {
          const situationEntity = entityName.startsWith("enfant")
            ? Individu.get(
                this.$store.getters.peopleParentsFirst,
                entityName.split("_"),
                entityName,
                this.$store.state.dates
              )
            : this.situation[entityName]
          accum.push(
            ...Object.entries(entity).reduce(
              (accum2, [propertyName, property]) => {
                const step = steps.find((step) => step.path === property.path)

                if (Array.isArray(property.openfiscaVariable)) {
                  accum2.push(
                    ...property.openfiscaVariable.map((openfiscaVariable) => {
                      return {
                        entityName: entityName,
                        propertyName: openfiscaVariable,
                        openfiscaVariable: openfiscaVariable,
                        value: situationEntity[openfiscaVariable],
                        path: property.path,
                        step: step,
                      }
                    })
                  )
                } else {
                  accum2.push({
                    entityName: entityName,
                    propertyName: propertyName,
                    openfiscaVariable: property.openfiscaVariable,
                    value: situationEntity[propertyName],
                    path: property.path,
                    step: step,
                  })
                }
                return accum2
              },
              []
            )
          )
          return accum
        },
        []
      )
    },
  },
  methods: {
    getPropertyValue(entityName, propertyName) {
      if (this.situation[entityName][propertyName] !== undefined)
        return this.situation[entityName][propertyName]

      return Array.isArray(this.contribution[entityName][propertyName])
        ? this.contribution[entityName][propertyName].map(
            (openfiscaVariable) => {
              return this.situation[entityName][openfiscaVariable]
            }
          )
        : `Pas de valeur`
    },
  },
}
</script>
