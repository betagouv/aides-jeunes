import BordeauxMetropole from "@/styles/themes/bordeaux-metropole.css?inline"
import LightBlue from "@/styles/themes/light-blue.css?inline"
import DefaultDsfr from "@/styles/themes/default-dsfr.css?inline"
import * as Sentry from "@sentry/vue"
import { Theme, ThemeLabel } from "@/../lib/enums/themes.js"

const options = [
  {
    title: ThemeLabel.Default,
    label: Theme.Default,
    value: DefaultDsfr,
  },
  {
    title: ThemeLabel.LightBlue,
    label: Theme.LightBlue,
    value: LightBlue,
  },
  {
    title: ThemeLabel.BordeauxMetropole,
    label: Theme.BordeauxMetropole,
    value: BordeauxMetropole,
  },
]

export default {
  install: (app) => {
    const styleElement = document.createElement("style")
    styleElement.textContent = DefaultDsfr
    document.head.appendChild(styleElement)

    app.config.globalProperties.$theme = {
      current: Theme.Default,
      options,
      update(newThemeLabel) {
        const match = options.find((option) => option.label === newThemeLabel)
        if (!match) {
          Sentry.captureMessage(`Invalid theme label ${newThemeLabel}`)
          return
        }
        this.current = newThemeLabel
        styleElement.textContent = match.value
      },
    }
  },
}
