<template>
  <button class="button outline with-icon" :class="[size]" type="button">
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z"
        fill="#030F8F"
      />
    </svg>
    <slot>Précédent</slot>
  </button>
</template>

<script>
export default {
  name: "BackButton",
  props: {
    size: {
      default: null,
    },
  },
}
</script>

<style scoped></style>
