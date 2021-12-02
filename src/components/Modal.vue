<template>
  <span>
    <component
      :is="tag || 'a'"
      v-analytics="{ action: 'Affiché', category: analyticsCategory }"
      @click="show"
      ><slot name="message"
    /></component>
    <div v-if="displayed" class="modal__backdrop" @click.self.prevent="hide">
      <div class="modal">
        <span
          v-analytics="{ action: 'Fermé bouton', category: analyticsCategory }"
          class="aj-modal-close"
          @click="hide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            />
          </svg>
        </span>
        <slot />
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: "Modal",
  props: {
    analyticsCategory: String,
    tag: String,
  },
  data: function () {
    return {
      displayed: false,
    }
  },
  created: function () {
    let that = this
    this.escapeHandler = function (evt) {
      if (evt.keyCode === 27 && that.displayed) {
        // esc
        that.$matomo &&
          that.$matomo.trackEvent(that.analyticsCategory, "Fermé ESC")
        that.hide()
      }
    }
    document.addEventListener("keyup", this.escapeHandler)
  },
  beforeUnmount: function () {
    document.removeEventListener("keyup", this.escapeHandler)
  },
  methods: {
    show: function () {
      this.displayed = true
    },
    hide: function () {
      this.displayed = false
    },
  },
}
</script>
<style scoped lang="scss">
.modal__backdrop {
  display: flex;
  align-items: flex-start;
  padding: 4em;
}
</style>
