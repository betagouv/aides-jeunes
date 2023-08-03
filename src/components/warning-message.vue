<template>
  <div class="fr-alert fr-alert--warning fr-my-1w">
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts">
export default {
  name: "WarningMessage",
}
</script>
