<template>
  <div>
    <h2> Récapitulatif contribution </h2>

    <div>
      <div>
        <h3>Détails de la contribution</h3>
        <ul>
          <li>Nom : {{ contribution._details.name }}</li>
          <li>Output : {{ contribution._details.output }}</li>
          <li>Description : {{ contribution._details.description }}</li>
          <li
            >Absolute_error_margin :
            {{ contribution._details.absolute_error_margin }}</li
          >
        </ul>
      </div>
      <h3>Résultats</h3>
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
    <div>
      <button @click="generateTestFile" class="button"
        >Générer le fichier de test</button
      >
      <div>Etat du test : {{ testStatus }}</div>
      <button class="button" @click="executeOpenfiscaTest">
        Tester l'aide</button
      >
    </div>
  </div>
</template>

<script>
import Individu from "@/lib/Individu"
import axios from "axios"

export default {
  name: "SimulationRecapitulatifContribution",
  components: {},
  data() {
    return {
      testStatus: false,
    }
  },
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
          if (entityName === "_details") return accum
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
    filename() {
      return `${this.contribution._details.name}-${this.$store.state.situation._id}`
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
    generateTestFile() {
      const details = {
        ...this.contribution._details,
        name: this.filename,
      }
      this.$store.dispatch("save", this.resultats).then(() => {
        axios.post(
          `api/situations/${this.$store.state.situation._id}/openfisca-test-file`,
          details
        )
      })
    },
    executeOpenfiscaTest() {
      axios
        .get(
          `api/situations/${this.$store.state.situation._id}/openfisca-execute-test`,
          { params: { filename: this.filename } }
        )
        .then(() => {
          // todo, gérer la réponse du fichier
        })
    },
  },
}
</script>
