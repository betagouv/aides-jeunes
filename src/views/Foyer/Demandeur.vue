<template>
  <div class="container">
    <div class="frame-foyer">
      <h1>Vous</h1>
      <IndividuForm/>
    </div>
    <button v-on:click="save">Save</button>
    <!-- <p>YOLO Demandeur</p>
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
      obj: this.$SituationService.restoreLocal(),
      saveResult: {}
    }
  },
  methods: {
    update: function() {
      this.$SituationService.update()
    },
    save: function() {
      let vm = this
      this.$SituationService.save(this.obj)
      .then(r => {
        vm.saveResult = r
      })
    }
  }
}
</script>
