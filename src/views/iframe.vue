<template>
  <article class="text container aj-text-container">
    <h2>Intégrez le simulateur sur votre site&nbsp;!</h2>
    <p
      >Notre simulateur est intégrable de manière transparente en ajoutant une
      simple ligne de code à votre page Web.</p
    >

    <h3>Code d'intégration</h3>
    <p>Voici le code à copier-coller sur votre site&nbsp;:</p>

    <code>{{ fullScript }}</code>

    <h3>Prévisualisation</h3>

    <div id="dest"></div>
  </article>
</template>

<script>
export default {
  name: "IFrame",
  mounted: function () {
    let externalScript = document.createElement("script")
    externalScript.setAttribute("src", this.scriptPath)
    document.getElementById("dest").appendChild(externalScript)
  },
  computed: {
    scriptPath() {
      return "/documents/integration.js"
    },
    fullScript() {
      // eslint-disable-next-line no-useless-escape
      return `<script src="${process.env.VUE_APP_BASE_URL}${this.scriptPath}"><\/script>`
    },
  },
}
</script>
<style scoped>
code {
  background-color: rgb(248, 248, 248);
  border-radius: unset;
}
</style>
