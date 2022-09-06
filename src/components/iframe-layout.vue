<template>
  <slot />
  <div id="iframe-footer">
    <p>Simulateur propulsé par&nbsp;</p>
    <a href="https://www.1jeune1solution.gouv.fr/" target="_blank">
      la plateforme 1jeune1solution
    </a>
  </div>
</template>

<script>
export default {
  name: "IFrameLayout",
}
</script>

<style>
html,
body {
  height: unset !important;
}

#iframe-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
</style>
