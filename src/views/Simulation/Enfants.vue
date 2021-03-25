<template>
  <div>
    <h2 class="aj-question">Mes enfants à charge</h2>
    <div v-for="enfant in enfants" class="aj-children-container" v-bind:key="enfant.id">
      <div class="small capitalize">
          {{ enfant._firstName }}
          <a class="float-right delete-link" v-on:click="removePAC(enfant.id)">supprimer</a>
          <router-link class="float-right" v-bind:to="`/simulation/individu/${enfant.id}/_firstName`" >éditer</router-link>
      </div>
      <hr class="aj-hr" />
      <div class="aj-children-line">
          <div class="aj-children-birth-date">
            <label>Sa date de naissance</label>
            <span>{{ enfant.date_naissance | birthDate }}</span>
          </div>
          <div class="aj-children-nationality">
              <label>Sa nationalité</label>
              <span>{{ enfant.nationalite | nationality }}</span>
          </div>
          <div class="aj-children-scolarite">
              <label>Sa situation</label>
              <span>{{ enfant.scolarite | scolarite }}</span>
          </div>
          <div class="aj-children-delete">

          </div>
      </div>
    </div>
    <button class="button outline with-icon m-auto" id="add-pac" v-on:click="addPAC()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4.25C7.5875 4.25 7.25 4.5875 7.25 5V7.25H5C4.5875 7.25 4.25 7.5875 4.25 8C4.25 8.4125 4.5875 8.75 5 8.75H7.25V11C7.25 11.4125 7.5875 11.75 8 11.75C8.4125 11.75 8.75 11.4125 8.75 11V8.75H11C11.4125 8.75 11.75 8.4125 11.75 8C11.75 7.5875 11.4125 7.25 11 7.25H8.75V5C8.75 4.5875 8.4125 4.25 8 4.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z" fill="#6575EA"/>
        </svg>
        Ajouter une personne à charge
    </button>
    <Actions v-bind:onSubmit='$push'>
    </Actions>
  </div>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'
import Nationality from '@/lib/Nationality'
import moment from 'moment'

const scolariteOptions = [
    {
        value: 'inconnue',
        label: 'Aucun des deux'
    },
    {
        value: 'college',
        label: 'Au collège'
    },
    {
        value: 'lycee',
        label: 'Au lycée / En CAP / En CPA'
    }
]

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
    filters: {
        birthDate: function (date) {
            return moment(date).format('DD/MM/YYYY')
        },
        nationality: Nationality.getNationalityFromCountryCode,
        scolarite: function (value) {
            const s = scolariteOptions.find((s) => s.value === value)
            if (s)
                return scolariteOptions.find((s) => s.value === value).label
            else
                return 'Non renseigné'
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


<style scoped lang="scss">
    .delete-link {
        margin-left: 10px;
    }
</style>
