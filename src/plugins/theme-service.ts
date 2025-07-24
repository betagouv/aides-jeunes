import BordeauxMetropole from "@/styles/themes/bordeaux-metropole.css?inline"
import LightBlue from "@/styles/themes/light-blue.css?inline"
import DefaultDsfr from "@/styles/themes/default-dsfr.css?inline"
import Soliguide from "@/styles/themes/soliguide.css?inline"
import MesAidesOrg from "@/styles/themes/mes-aides-org.css?inline"
import ArcEnCiel from "@/styles/themes/arc-en-ciel.css?inline"
import * as Sentry from "@sentry/vue"
import { Theme, ThemeLabel } from "@/../lib/enums/themes.js"

const options = [
  {
    title: ThemeLabel.MesAidesOrg,
    label: Theme.MesAidesOrg,
    value: MesAidesOrg,
  },
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
  {
    title: ThemeLabel.Soliguide,
    label: Theme.Soliguide,
    value: Soliguide,
  },
  {
    title: ThemeLabel.ArcEnCiel,
    label: Theme.ArcEnCiel,
    value: ArcEnCiel,
  },
]

export default {
  install: (app) => {
    const styleElement = document.createElement("style")
    styleElement.textContent = options[0].value
    document.head.appendChild(styleElement)

    app.config.globalProperties.$theme = {
      current: options[0].label,
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
