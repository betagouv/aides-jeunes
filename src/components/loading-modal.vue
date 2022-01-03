<template>
  <div class="aj-loading-modal">
    <div class="aj-loading-modal-content">
      <slot />
      <div class="text-center">
        <i class="fa fa-spinner fa-2x fa-spin" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingModal",
}
</script>
