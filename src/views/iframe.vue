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

    <h3>Customisation de l'iframe</h3>
    <p
      >Si vous souhaitez intégrer cette iframe mais que vous souhaitez que nous
      y apportions des modifications spécifiques, vous pouvez contacter l'équipe
      directement à cette adresse
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
      >.</p
    >
  </article>
</template>

<script>
export default {
  name: "IFrame",
  data() {
    return {
      contactEmail: process.env.VITE_CONTACT_EMAIL,
    }
  },
  computed: {
    scriptPath() {
      return "/documents/iframe-integration.js"
    },
    fullScript() {
      // eslint-disable-next-line no-useless-escape
      return `<script src="${process.env.VITE_BASE_URL}${this.scriptPath}"><\/script>`
    },
  },
  mounted: function () {
    let externalScript = document.createElement("script")
    externalScript.setAttribute("src", this.scriptPath)
    document.getElementById("dest").appendChild(externalScript)
  },
}
</script>
<style scoped>
code {
  background-color: rgb(248, 248, 248);
  border-radius: unset;
}
</style>
