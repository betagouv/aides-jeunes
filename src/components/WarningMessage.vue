<template>
  <div class="notification warning">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "WarningMessage",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
}
</script>
