<template>
  <div>
    <form>
      <div>
        <p>Les personnes de <span data-tooltip="Les personnes à votre charge de plus de 25 ans non handicapées ne changent pas votre éligibilité aux aides calculées par ce simulateur.">moins de 25 ans ou handicapées</span> dont vous assumez la responsabilité, même sans lien de parenté.</p>
      </div>
      <div class="children">
        <router-link v-for="enfant in enfants" v-bind:key="enfant.id" class="child"
          v-bind:to="{ name: 'enfants/modifier', params:{ id: enfant.id }}">
          <button type="button" class="close" v-on:click.prevent="removeEnfant(enfant)">
            <span class="sr-only">Effacer {{ enfant._firstName }}</span>
            <span role="presentation" aria-hidden="true">&times;</span>
          </button>
          <h2>{{ enfant._firstName | capitalize }}</h2>
          <div class="details">
            <span class="card-icon fa fa-child" aria-hidden="true"></span>
            <div>
              Né·e le <strong>{{ enfant.date_naissance.toLocaleDateString() }}</strong>
              <!-- TODO3 <br>Nationalité <strong>{{ nationalite(enfant) }}</strong>
              <br><i>{{ statutsSpecifiques(enfant) }}</i> -->
            </div>
          </div>
        </router-link>
        <router-link class="new-entity child"
          to="/foyer/enfants/ajouter">
          <h2>Ajouter un enfant</h2>
          <span class="card-icon fa fa-plus" aria-hidden="true" />
        </router-link>
      </div>
      <div class="text-right">
        <button type="submit" class="button large" v-if="showValidate" v-on:click.prevent="next">Valider</button>
      </div>
    </form>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'enfants',
  components: {
  },
  computed: {
    enfants: function() {
      return this.$store.state.situation.enfants
    },
    showValidate: function() {
      return this.$route.path === '/foyer/enfants'
    }
  },
  methods: {
    next: function() {
      this.$push()
    },
    removeEnfant: function(enfant) {
        this.$store.dispatch('removeEnfant', enfant.id)

        if (this.$route.name === 'enfants/modifier' && this.$route.params.id === enfant.id) {
          this.$router.push('/foyer/enfants')
        }
    }
  }
}
</script>


<style scoped lang="css">
</style>
