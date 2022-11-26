<template>
  <article class="fr-article">
    <h1>Intégrez le simulateur sur votre site&nbsp;!</h1>
    <p
      >Notre simulateur est intégrable de manière transparente en ajoutant une
      simple ligne de code à votre page Web.</p
    >

    <h2>Code d'intégration</h2>
    <p>Voici le code à copier-coller sur votre site&nbsp;:</p>

    <p
      ><code class="fr-text--sm fr-p-1v">{{ fullScript }}</code></p
    >
    <div class="fr-form-group">
      <fieldset class="fr-fieldset fr-fieldset--inline">
        <legend
          class="fr-fieldset__legend fr-text--regular"
          id="checkboxes-inline-legend"
        >
          Plusieurs options s'offrent à vous pour personnaliser l'affichage du
          simulateur :
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-checkbox-group">
            <input
              type="checkbox"
              checked="true"
              v-model="options"
              id="data-from-home"
              value="data-from-home"
            />
            <label for="data-from-home" class="fr-label"
              >Afficher l'écran d'accueil</label
            >
          </div>
          <div class="fr-checkbox-group">
            <input
              type="checkbox"
              checked="true"
              v-model="options"
              id="data-with-logo"
              value="data-with-logo"
            />
            <label for="data-with-logo" class="fr-label"
              >Afficher les logos institutionel</label
            >
          </div>
        </div>
      </fieldset>
    </div>

    <h2>Prévisualisation</h2>

    <div id="dest" class="fr-col-11 fr-m-auto"></div>

    <h2>Customisation de l'iframe</h2>
    <p
      >Si vous voulez intégrer cette iframe mais que vous souhaitez que nous y
      apportions des modifications spécifiques, vous pouvez contacter l'équipe
      directement à cette adresse
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
      >.<br />Merci !
    </p>
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
