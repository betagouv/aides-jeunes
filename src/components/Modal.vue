<template>
  <span>
    <component v-bind:is="tag || 'a'"
      v-on:click="show"
      v-analytics="{ action: 'Affiché', category:analyticsCategory}"
    ><slot name="message"></slot></component>
    <div v-if="displayed" class="modal__backdrop"
      v-on:click.self.prevent="hide">
      <div class="modal">
        <slot></slot>
        <div class="form__group button__group">
          <a class="button"
            v-analytics="{ action: 'Fermé bouton', category:analyticsCategory}"
            v-on:click="hide">
            Fermer
          </a>
        </div>
      </div>
    </div>
  </span>
</template>

<script>

export default {
  name: 'Modal',
  props: {
    analyticsCategory: String,
    tag: String,
  },
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
    this.escapeHandler = function (evt) {
      if (evt.keyCode === 27) { // esc
        that.$matomo && that.$matomo.trackEvent(that.analyticsCategory, 'Fermé ESC')
        that.hide()
      }
    }
    document.addEventListener('keyup', this.escapeHandler)
  },
  beforeDestroy: function() {
    document.removeEventListener('keyup', this.escapeHandler)
  }
}
</script>
<style scoped lang="scss">
.modal__backdrop {
  display: flex;
  align-items: flex-start;
  padding: 4em;
}

</style>
