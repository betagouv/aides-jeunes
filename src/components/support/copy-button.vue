<template>
  <button
    class="copy-button fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
    @click="() => copyBenefitsList(benefitsList)"
    >Copier</button
  >
</template>
<script>
export default {
  name: "CopyButton",
  props: {
    followupId: String,
    benefitsMap: Function,
    benefitsList: Object,
  },
  data() {
    return {
      simulationId: "",
    }
  },
  methods: {
    copyBenefitsList: function (benefitsList) {
      const container = document.createElement("div")
      const prepend = `Bonjour,\n\nJe vous écris car vous avez utilisé le simulateur d'aides du site 1jeune1solution.gouv.fr, et que vous avez effectué des démarches pour demander les aides qui se sont affichées en fin de simulation (identifiant de simulation : ${this.followupId}).\n\nIl s'agissait des aides suivantes :\n`

      const append = `Nous vous avons écrit la semaine qui a suivi la simulation pour savoir si vous aviez demandé les aides, et vous avez indiqué que`
      if (benefitsList?.length) {
        const list = document.createElement("ul")
        for (let benefit of benefitsList) {
          const benefitItem = document.createElement("li")
          const benefitLink = document.createElement("a")
          const benefitTitle = this.benefitsMap(benefit.id)?.label || benefit.id
          benefitLink.innerText = benefitTitle.replace(/(^[a-z])/, (l) =>
            l.toUpperCase()
          )

          benefitLink.href = `${process.env.VITE_BASE_URL}/aides/${benefit.id}`
          benefitItem.appendChild(benefitLink)
          list.appendChild(benefitItem)
        }

        const prependBlock = document.createElement("div")
        prependBlock.innerText = prepend
        const appendBlock = document.createElement("div")
        appendBlock.innerText = append
        container.appendChild(prependBlock)
        container.appendChild(list)
        container.appendChild(appendBlock)

        // In order to copy the rich-text we need to add it to the page
        document.body.appendChild(container)
        window.getSelection().removeAllRanges()
        let range = document.createRange()
        range.selectNode(container)
        window.getSelection().addRange(range)
        document.execCommand("copy")
        window.getSelection().removeAllRanges()
        container.remove()
      }
    },
  },
}
</script>
