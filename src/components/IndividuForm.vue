<template>
  <form @submit.prevent="submit">
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'IndividuForm',
  props: {
    //msg: String
  },
  data: function() {
    return {
      maxAgeYears: 12,
      submitted: false,
      individu: {

      }
    }
  },
  methods: {
    submit: function() {
      this.$v.$touch()
    },
  },
  validations: {
    individu: {
      date_naissance: { required }
    }
  }
}
</script>

<style scoped lang="scss">
input:invalid {
  border: 2px solid red;
}
</style>
