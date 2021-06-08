<template>
  <form>
    <label class="form__group">
      Montant de l'abattement annuel de <a href="https://www.assemblee-nationale.fr/dyn/15/amendements/3970/CION-SOC/AS1" target="_blank" rel="noopener">l'amendement n°51</a> (5000 € dans les exemples)&nbsp;:
      <input type="number" v-select-on-click v-model.number="aah_abattement_forfaitaire_amendement">
    </label>

    <div class="text-right">
      <button type="submit" class="button large" v-on:click.prevent="next">Valider</button>
    </div>
  </form>
</template>

<script>

export default {
  name: 'aah',
  data () {
    const famille = this.$store.state.situation.famille
    return {
      famille,
      aah_abattement_forfaitaire_amendement: famille.aah_abattement_forfaitaire_amendement,
    }
  },
  methods: {
    next: function() {
      this.$store.dispatch('updateFamille', Object.assign({}, this.famille, {
        aah_abattement_forfaitaire_amendement: this.aah_abattement_forfaitaire_amendement
      }))
      this.$push()
    },
  }
}
</script>

<style scoped lang="css">
</style>
