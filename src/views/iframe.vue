<template>
  <article class="fr-article">
    <h1>Intégrez le simulateur sur votre site&nbsp;!</h1>
    <p
      >Notre simulateur est intégrable de manière transparente en ajoutant une
      simple ligne de code à votre page Web.</p
    >
    <p>
      Le script de son intégration est accessible
      <a
        href="https://github.com/betagouv/aides-jeunes/blob/master/iframes/iframe-integration.js"
        target="_blank"
        >sur le dépôt hébergeant notre code </a
      >.
    </p>
    <h2>Code d'intégration</h2>
    <p>Voici le code à copier-coller sur votre site&nbsp;:</p>

    <p
      ><code class="fr-text--sm fr-p-1v">{{ fullScript }}</code></p
    >
    <div class="fr-form-group">
      <fieldset class="fr-fieldset fr-fieldset--inline">
        <legend
          id="checkboxes-inline-legend"
          class="fr-fieldset__legend fr-text--regular"
        >
          Plusieurs options s'offrent à vous pour personnaliser l'affichage du
          simulateur&nbsp;:
        </legend>
        <div class="fr-fieldset__content">
          <div class="fr-checkbox-group">
            <input
              id="data-from-home"
              v-model="options"
              type="checkbox"
              checked="true"
              value="data-from-home"
            />
            <label for="data-from-home" class="fr-label"
              >Afficher l'écran d'accueil</label
            >
          </div>
          <div class="fr-checkbox-group">
            <input
              id="data-with-logo"
              v-model="options"
              type="checkbox"
              checked="true"
              value="data-with-logo"
            />
            <label for="data-with-logo" class="fr-label"
              >Afficher les logos institutionnels</label
            >
          </div>
        </div>
      </fieldset>
      <fieldset class="fr-fieldset fr-fieldset--inline">
        <legend
          id="checkboxes-inline-legend"
          class="fr-fieldset__legend fr-text--regular"
        >
          Différents thèmes couleur sont également disponibles&nbsp;:
        </legend>
        <div class="fr-row">
          <div
            v-for="(option, index) in $theme.options"
            :key="index"
            class="fr-radio-group fr-radio-rich fr-mb-2w fr-mt-1w"
          >
            <input
              :id="option.label"
              v-model="selectedTheme"
              type="radio"
              :value="option.label"
              :checked="index === 0"
            />
            <label :for="option.label" class="fr-label">{{
              option.title
            }}</label>
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
  data() {
    return {
      contactEmail: process.env.VITE_CONTACT_EMAIL,
      options: ["data-from-home", "data-with-logo"],
      selectedTheme: "theme-default-dsfr",
      scriptPath: "/documents/iframe-integration.js",
    }
  },
  computed: {
    fullScript() {
      /* eslint-disable no-useless-escape */
      return `<script src="${process.env.VITE_BASE_URL}${
        this.scriptPath
      }" ${this.options.join(" ")} ${this.selectedTheme}><\/script>`
    },
  },
  watch: {
    options: function (): void {
      this.setIframeContainer()
    },
    selectedTheme: function (theme) {
      this.$theme.update(theme)
      this.setIframeContainer()
    },
  },
  mounted: function () {
    this.setIframeContainer()
  },
  methods: {
    setIframeContainer() {
      let externalScript = document.createElement("script")
      externalScript.setAttribute("src", this.scriptPath)
      for (let option of this.options) {
        externalScript.setAttribute(option, "")
      }
      externalScript.setAttribute(this.selectedTheme, "")
      document.getElementById("dest").replaceChildren(...[externalScript])
    },
  },
}
</script>
