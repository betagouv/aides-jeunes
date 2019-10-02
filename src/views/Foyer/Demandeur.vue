<template>
  <div>
    <div class="frame-foyer">
      <h1>Vous</h1>
      <IndividuForm/>
    </div>
    <!-- <p>YOLO Demandeur</p>
    <button v-on:click="update">Update</button>
    <pre>{{JSON.stringify(obj, null, 2)}}</pre>
 -->

    <router-link to="/foyer/resultat">Continue</router-link>
  </div>
</template>

<script>
import IndividuForm from '@/components/IndividuForm.vue'

export default {
  name: 'demandeur',
  components: {
    IndividuForm
  },
  data () {
    return {
      obj: this.$situationService.restoreLocal()
    }
  },
  methods: {
    update: function() {
      this.$situationService.update()
    }
  }
}
</script>
