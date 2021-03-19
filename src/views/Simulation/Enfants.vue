<template>
  <div>
    <h1>Vos enfants</h1>
    <ul>
      <li v-for="(enfant) in enfants" v-bind:key="enfant.id">
         <router-link v-bind:to="`/simulation/individu/${enfant.id}/_firstName`" >{{enfant._firstName}}</router-link>
         &nbsp;<button class="button small warning" v-on:click="removePAC(enfant.id)">supprimer</button>
      </li>
    </ul>
    <button class="button large" id="add-pac" v-on:click="addPAC()">Ajouter une personne à charge</button>
    <Actions v-bind:onSubmit='$push'>
    </Actions>
  </div>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationEnfants',
  components: {
    Actions,
  },
  computed: {
    enfants: function() {
      return [].concat(...this.$store.state.situation.enfants)
    } 
  },
  methods: {
    addPAC: function() {
      let { individu } = Individu.get(this.$store.state.situation.enfants, 'enfant', 1, this.$store.state.dates)
      this.$store.dispatch('addEnfant', individu)
      this.$router.push(`/simulation/individu/${individu.id}/_firstName`)
    },
    removePAC: function(id) {
      this.$store.dispatch('removeEnfant', id)
    }
  }
}
</script>
