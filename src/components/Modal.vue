<template>
  <span>
    <a v-on:click="show"><slot name="message"></slot></a>
    <div v-if="displayed" class="modal__backdrop" v-on:click.self.prevent="hide">
      <div class="modal">
        <slot></slot>
        <div class="form__group button__group">
          <a class="button" v-on:click="hide">Valider</a>
        </div>
      </div>
    </div>
  </span>
</template>

<script>

export default {
  name: 'Modal',
  data: function() {
    return {
      displayed: false
    }
  },
  methods: {
    show: function() {
      this.displayed = true
    },
    hide: function() {
      this.displayed = false
    }
  },
  created: function() {
    let that = this
    document.addEventListener('keyup', function (evt) {
      if (evt.keyCode === 27) { // esc
        that.hide()
      }
    })
  },
}
</script>
<style scoped lang="scss">
.modal__backdrop {
  display: flex;
}
</style>
