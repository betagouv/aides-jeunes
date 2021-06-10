<template>
  <div class="inline-block">
    {{ text }}
  </div>
</template>

<script>
import Warning from "../lib/Warnings"
export default {
  name: "WarningMessage",
  props: {
    attribute: {
      type: String,
      required: true,
    },
  },
  computed: {
    text: function () {
      return Warning.get(this.attribute)
    },
  },
}
</script>
