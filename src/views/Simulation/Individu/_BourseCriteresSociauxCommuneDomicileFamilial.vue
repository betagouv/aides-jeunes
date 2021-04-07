<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
      <label class="aj-question">Quel est le code postal de la commune de vos parents ?</label>
      <input type="number" v-model="codePostal">
    </fieldset>

      <p v-if="retrievingCommunes"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
      <fieldset v-show="communes && communes.length">
          <label class="aj-question">Veuillez selectionner la ville qui correspond</label>
          <select
              v-model="nomCommune"
              id="commune">
              <option v-for="commune in communes" v-bind:value="commune.nom" v-bind:key="commune.code">
                  {{ commune.nom }}
              </option>
          </select>
      </fieldset>
  <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>
<script>
import Actions from '@/components/Actions'
import Commune from '@/lib/Commune'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxCommuneDomicileFamilial',
  components: {
    Actions,
  },
  data(){
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const { individu } = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const codePostal = individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal
    const nomCommune = individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune
    return {
      codePostal,
      individu,
      nomCommune,
      retrievingCommunes: false,
    }
  },
  asyncComputed: {
    communes: {
        get: function() {
            if (! this.codePostal || this.codePostal.toString().length !== 5) {
                return []
            }
            this.retrievingCommunes = true
            return Commune.get(this.codePostal)
                .then((communes) => {
                    if (!communes.map(c => c.nom).includes(this.nomCommune)) {
                        this.nomCommune = Commune.getMostPopulated(communes).nom
                    }
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
  methods: {
    onSubmit: function() {
      if (this.nomCommune === undefined) {
          this.$store.dispatch('updateError', 'Ce champ est obligatoire.')
          return
      }
      const communeMatches = this.communes.filter(c => c.nom == this.nomCommune)
      if (communeMatches.length) {
          this.individu._BourseCriteresSociauxCommuneDomicileFamilial = communeMatches[0].code
          this.individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal = this.codePostal.toString()
          this.individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune = this.nomCommune
          this.$store.dispatch('updateIndividu', this.individu)
      }
      this.$push()
    }
  }
}
</script>
<style scoped lang="scss">
    span.help {
        font-style: italic;
        display: block;
        font-size: 0.8em;
    }

    fieldset {
        margin-bottom: 2em;
    }
</style>

