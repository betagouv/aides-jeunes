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
    <p
      >Plusieurs options s'offrent à vous pour personnaliser l'affichage du
      simulateur :</p
    >
    <ul class="options-list">
      <li>
        <input
          type="checkbox"
          checked="true"
          v-model="options"
          id="data-from-home"
          value="data-from-home"
        />
        <label for="data-from-home">Afficher l'écran d'accueil</label>
      </li>
      <li>
        <input
          type="checkbox"
          checked="true"
          v-model="options"
          id="data-with-logo"
          value="data-with-logo"
        />
        <label for="data-with-logo">Afficher les logos institutionel</label>
      </li>
    </ul>

    <h3>Prévisualisation</h3>

    <div id="dest"></div>

    <h3>Customisation de l'iframe</h3>
    <p
      >Si vous voulez intégrer cette iframe mais que vous souhaitez que nous y
      apportions des modifications spécifiques, vous pouvez contacter l'équipe
      directement à cette adresse
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
      >.<br />Merci !</p
    >
  </article>
</template>

<script lang="ts">
export default {
  name: "IFrame",
  data() {
    return {
      options: ["data-from-home", "data-with-logo"],
      contactEmail: process.env.VITE_CONTACT_EMAIL,
    }
  },
  computed: {
    scriptPath() {
      return "/documents/iframe-integration.js"
    },
    fullScript() {
      // eslint-disable-next-line no-useless-escape
      return `<script src="${process.env.VITE_BASE_URL}${
        this.scriptPath
      }" ${this.options.join(" ")}><\/script>`
    },
  },
  mounted: function () {
    this.setIframeContainer()
  },
  watch: {
    options: function (): void {
      this.setIframeContainer()
    },
  },
  methods: {
    setIframeContainer() {
      let externalScript = document.createElement("script")
      externalScript.setAttribute("src", this.scriptPath)
      for (let option of this.options) {
        externalScript.setAttribute(option, "")
      }
      document.getElementById("dest").replaceChildren(...[externalScript])
    },
  },
}
</script>
<style scoped>
#dest {
  max-width: 1000px;
  margin: auto;
}
code {
  background-color: rgb(248, 248, 248);
  border-radius: unset;
}
.options-list {
  display: flex;
  gap: 2rem;
  padding: 0;
}
.options-list li {
  display: flex;
  vertical-align: middle;
}
.options-list li input {
  margin-right: none;
  cursor: pointer;
}
</style>
