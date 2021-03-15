<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <label v-for="logementType in logementTypes" v-bind:key="logementType.id">
        <input type="radio" name="logementType" v-model="type" v-bind:value="logementType.id"
          />
          {{ logementType.label | capitalize }}
          <span class="help">{{ logementType.hint }}</span>
      </label>
    </fieldset>

    <p>Notes</p>
    <ul>
      <li>
        Propriétaire
        <ul>
            <li>Primo?
            </li>
        </ul>
      </li>
      <li>
        Locataire
        <ul>
            <li>Type de logement
            </li>
        </ul>
      </li>
      <li>
        Hébergé
      </li>
      <li>
        Sans domicile stable
      </li>
    </ul>

    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import Actions from '@/components/Actions'

export default {
  name: 'SimulationIndividuDateNaissance',
  components: {
    Actions,
  },
  data: function() {
    return {
      type: null,
      logementTypes: [{
        label: 'AA',
        id: 'aa',
        hint: 'hint'
      }]
    }
  },
  methods: {
    onSubmit: function() {
      // this.$store.dispatch('updateMenage', {
      //   statut_occupation_logement: 'TODO'
      // })
      this.$push()
    }
  }
}
</script>