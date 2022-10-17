<template>
  <div class="aj-loading-modal">
    <div class="aj-loading-modal-content">
      <slot />
      <div class="text-center">
        <i aria-hidden="true" class="ri ri-loader-2-line ri-spin ri-2x" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingModal",
}
</script>
