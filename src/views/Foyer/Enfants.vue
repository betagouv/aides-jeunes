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
            <span class="sr-only">Effacer {{ enfant.firstName }}</span>
            <span role="presentation" aria-hidden="true">&times;</span>
          </button>
          <h2>{{ enfant.firstName | capitalize }}</h2>
          <div class="details">
            <span class="card-icon fa fa-child" aria-hidden="true"></span>
            <div>
              Né·e le <strong>{{ enfant.date_naissance.toISOString().slice(0,10) }}</strong>
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
.children {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;
}

.child {
  border: 1px solid #DDD;
  box-shadow: 0 .2em .4em rgba(0, 0, 0, 0.4);
  padding: 1em;
  padding-top: .25em;
  margin-bottom: 1em;
  flex-grow: 1;
  margin: 15px;
  text-decoration: none;
}

.child:hover:not(.new-entity) {
  cursor: pointer;
  /*border: 1px solid #CCC;*/
  box-shadow: 0 .2em .4em rgba(0, 0, 0, 0.5);
}

@media (max-width: 991px) {
  .child {
    width: calc(100% - 30px);
  }
}

@media (min-width: 992px) {
  .child {
    max-width: calc(50% - 30px);
  }
}
@media (min-width: 1200px) {
  .child {
    max-width: calc(33.3333% - 30px);
  }
}

.child.active, .child.active:active {
  border: 1px solid #008cba;
  box-shadow: 0 .2em .4em rgba(0, 140, 186, 0.4);
}

.child h2 {
  margin-top: .5em;
}

.close {
  float: right;
  color: black;
  margin-top: .25em;
}

.new-entity {
  padding: 0 2em 1em 2em;
  border: .25em dashed #DDD;
  box-shadow: none;
  width: 100%;
  text-align: center;
}

.card-icon {
  font-size: 430%;
}

.details {
  display: flex;
  justify-content: space-between;
}

</style>
