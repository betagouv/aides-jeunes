<template>
  <span>
    <component v-bind:is="tag || 'a'"
      v-on:click="show"
      v-analytics="{ action: 'Affiché', category:analyticsCategory}"
    ><slot name="message"></slot></component>
    <div v-if="displayed" class="modal__backdrop"
      v-on:click.self.prevent="hide">
      <div class="modal">
          <span class="aj-modal-close" v-analytics="{ action: 'Fermé bouton', category:analyticsCategory}"
             v-on:click="hide">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </span>
        <slot></slot>
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
      if (evt.keyCode === 27 && that.displayed) { // esc
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
