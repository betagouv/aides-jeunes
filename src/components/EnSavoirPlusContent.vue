<template>
  <div>
    <div
      class="aj-help-modal"
      :class="{ open: open }"
      @click="window && window.history.back()"
    >
      <div
        class="aj-help-modal-container"
        @click.stop
      >
        <span class="aj-help-modal-header">
          <h4>En savoir plus</h4>
          <svg
            class="aj-help-modal-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="window && window.history.back()"
          >
            <path
              d="M18.925 1.08919C18.3725 0.536687 17.48 0.536687 16.9275 1.08919L10 8.00252L3.07252 1.07502C2.52002 0.52252 1.62752 0.52252 1.07502 1.07502C0.52252 1.62752 0.52252 2.52002 1.07502 3.07252L8.00252 10L1.07502 16.9275C0.52252 17.48 0.52252 18.3725 1.07502 18.925C1.62752 19.4775 2.52002 19.4775 3.07252 18.925L10 11.9975L16.9275 18.925C17.48 19.4775 18.3725 19.4775 18.925 18.925C19.4775 18.3725 19.4775 17.48 18.925 16.9275L11.9975 10L18.925 3.07252C19.4634 2.53419 19.4634 1.62752 18.925 1.08919Z"
              fill="#030F8F"
            />
          </svg>
        </span>
        <div class="aj-help-modal-content">
          {{ text }}
        </div>
        <BackButton
          class="aj-help-modal-back-button"
          size="small"
          @click.native="window && window.history.back()"
        >
          Retour
        </BackButton>
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/lib/Hint"
import BackButton from "@/components/Buttons/BackButton"

export default {
  name: "EnSavoirPlusContent",
  components: {
    BackButton,
  },
  data() {
    return {
      open: false,
      window,
    }
  },
  computed: {
    attribute: function () {
      return this.$route.params.parent.split("/").pop()
    },
    source: function () {
      return this.$route.params.parent
    },
    text: function () {
      return Hint.get(this.attribute, this.source)
    },
  },
  mounted() {
    this.open = true
  },
}
</script>
