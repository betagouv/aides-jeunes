<template>
  <fieldset>
    <input id="fr" type="radio" name="nationalite" v-model="zone" value="fr" />
    <label for="fr">
      Française
    </label>
    <input id="ue" type="radio" name="nationalite" v-model="zone" value="ue" />
    <label for="ue">
      Européenne
    </label>
    <input id="autre" type="radio" name="nationalite" v-model="zone" value="autre" />
    <label for="autre">
      Non européenne
    </label>
  </fieldset>
</template>


<script>

import Nationality from '@/lib/Nationality'


export default {
  name: 'NationalityChoice',
  components: {
  },
  props: {
    value: String
  },
  computed: {
    zone: {
        get: function() {
          return Nationality.getZone(this.value)
        },
        set: function(value) {
          this.$emit('input', Nationality.getCountryCodeByNationality(value))
        }
    }
  }
}
</script>
