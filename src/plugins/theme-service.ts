import bordeauxMetropole from "@/styles/themes/bordeaux-metropole.css?inline"
import lightBlue from "@/styles/themes/light-blue.css?inline"
import defaultDsfr from "@/styles/themes/default-dsfr.css?inline"
import * as Sentry from "@sentry/vue"
import { ThemeType, ThemeTypeLabel } from "@/../lib/enums/themes.js"

const options = [
  {
    title: ThemeTypeLabel.default,
    label: ThemeType.default,
    value: defaultDsfr,
  },
  {
    title: ThemeTypeLabel.lightBlue,
    label: ThemeType.lightBlue,
    value: lightBlue,
  },
  {
    title: ThemeTypeLabel.bordeauxMetropole,
    label: ThemeType.bordeauxMetropole,
    value: bordeauxMetropole,
  },
]

export default {
  install: (app) => {
    const styleElement = document.createElement("style")
    document.head.appendChild(styleElement)

    app.config.globalProperties.$theme = {
      current: ThemeType.default,
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
