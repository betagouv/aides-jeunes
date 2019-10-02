<template>
  <div>
    <p>YOLO Recap</p>
    <button v-on:click="update">Update</button>
    <pre>{{JSON.stringify(obj, null, 2)}}</pre>
  </div>
</template>

<script>

export default {
  name: 'FoyerRecap',
  data () {
    return {
      obj: this.$situationService.restoreLocal()
    }
  },
  methods: {
    update: function() {
      //this.obj.values.push(0);
    }
  }
}
</script>
