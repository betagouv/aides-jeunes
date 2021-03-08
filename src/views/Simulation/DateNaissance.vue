<template>
  <div>
    <h2>Quelle est votre date de naissance&nbsp;?</h2>
    <InputDate id="date-de-naissance" v-model="date_naissance" />
  </div>
</template>

<script>
import InputDate from '@/components/InputDate'

export default {
  name: 'SimulationDateNaissance',
  data: function() {
    let date_naissance = new Date('1989-12-13')
    return {
      date_naissance,
    }
  },
  components: {
    InputDate,
  },
}
</script>
