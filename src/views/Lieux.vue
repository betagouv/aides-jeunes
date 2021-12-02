<template>
  <div class="container">
    <h1>Trouver des lieux d'accueil et d'accompagnement près de chez vous</h1>
    <div class="form__group city">
      <div>
        <label for="postal-code">Votre code postal</label>
        <input id="postal-code" v-model="codePostal" />
      </div>
      <div v-if="communes.length">
        <label for="commune">Ville</label>
        <select id="commune" v-model="depcom">
          <option
            v-for="commune in communes"
            :key="commune.code"
            :value="commune.code"
          >
            {{ commune.nom }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="depcom" class="form__group types">
      <div v-for="type in types" :key="type.code" class="type">
        <label :for="`type-${type.code}`">{{ type.name }}</label>
        <input
          :id="`type-${type.code}`"
          v-model="type.selected"
          type="checkbox"
          :name="`type-${type.code}`"
        />
      </div>
      <span v-show="updating"
        ><i class="fa fa-spinner fa-spin" aria-hidden="true" /> Récupération en
        cours…</span
      >
    </div>
    <div>
      <div v-if="places && places.length">
        <div v-for="(etablissement, index) in places" :key="index">
          <Etablissement :etablissement="etablissement" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

import Etablissement from "@/components/Etablissement"
import EtablissementLib from "@/lib/Etablissement"
import Commune from "@/lib/Commune"

export default {
  name: "Lieux",
  components: {
    Etablissement,
  },
  data: function () {
    return {
      codePostal: undefined,
      depcom: undefined,
      communes: [],
      types: [
        {
          name: "CAF",
          code: "caf",
          selected: true,
        },
        {
          name: "CPAM",
          code: "cpam",
          selected: true,
        },
        {
          name: "CARSAT",
          code: "carsat",
          selected: true,
        },
        {
          name: "Mairie",
          code: "mairie",
          selected: true,
        },
      ],
      updating: false,
      places: [],
    }
  },
  computed: {
    uri: function () {
      if (!this.depcom) {
        return
      }
      const types = this.types.filter((t) => t.selected).map((t) => t.code)
      if (!types.length) {
        return
      }
      return `https://etablissements-publics.api.gouv.fr/v3/communes/${
        this.depcom
      }/${types.join("+")}`
    },
  },
  watch: {
    codePostal: function (newCodePostal) {
      if (
        !newCodePostal ||
        !newCodePostal.length ||
        newCodePostal.length != 5
      ) {
        return
      }

      Commune.get(newCodePostal).then((l) => (this.communes = l))
    },
    uri: function (newURI) {
      if (!newURI) {
        this.places = []
        return
      }
      this.updating = true
      axios
        .get(newURI)
        .then(
          function (response) {
            return response.data.features
          },
          function () {
            return []
          }
        )
        .then(function (etablissements) {
          return etablissements.map(EtablissementLib.normalize)
        })
        .then((o) => {
          this.places = o
        })
        .finally(() => {
          this.updating = false
        })
    },
  },
}
</script>

<style lang="scss">
@media (min-width: 600px) {
  .city {
    display: flex;
    align-items: flex-start;
    div {
      padding: 0.5em;
    }
    select {
      min-width: 300px;
    }
  }
}

.types,
.type {
  display: flex;
}

.type label {
  padding-right: 0.3em;
  padding-left: 1em;
}
</style>
