<template>
  <div>
    <div class="row">
      <div>
        <label for="postal-code">Code postal</label>
        <div>
          <input
            type="text"
            minlength="5"
            maxlength="5"
            id="postal-code"
            required
            v-model="menage.code_postal">
          <span v-if="false/*TODOsubmitted && ! isAddressValid*/">Ce code postal est invalide</span>
        </div>
      </div>
    </div>

    <div>
      <div>
        <p v-if="retrievingCommunes"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        <div v-show="communes && communes.length">
          <label for="commune">Ville</label>
          <div>
            <select
              v-model="selectedCommune"
              id="commune">
              <option v-for="commune in communes" v-bind:value="commune.code" v-bind:key="commune.code">
                {{ commune.nom }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import Commune from '@/lib/Commune'

export default {
  name: 'CommuneInput',
  props: {
    menage: Object
  },
  data: function() {
    return {
      retrievingCommunes: false,
    }
  },
  asyncComputed: {
    communes: {
      get: function() {
        if (! this.menage.code_postal || this.menage.code_postal.length !== 5) {
            return []
        }

        this.retrievingCommunes = true
        return Commune.get(this.menage.code_postal)
          .then((communes) => {
            return communes
          })
          .catch(() => {
            return []
          })
          .finally(() => {
            this.retrievingCommunes = false
          })
      },
      default: []
    },
  },
  computed: {
    selectedCommune: {
      get: function() {
        const commune = _.find(this.communes, { code: this.menage.depcom }) || Commune.getMostPopulated(this.communes)
        return commune && commune.code
      },
      set: function(code) {
        const commune = _.find(this.communes, { code })
        if (commune) {
          this.menage.depcom = commune.code
          this.menage.nom_commune = commune.nom
          // TODO Parisien
        }
      }
    },
  }
}
</script>
