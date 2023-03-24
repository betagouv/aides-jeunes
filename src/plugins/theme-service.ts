import bordeauxMetropole from "@/styles/themes/bordeaux-metropole.css?inline"
import lightBlue from "@/styles/themes/light-blue.css?inline"
import defaultDsfr from "@/styles/themes/default-dsfr.css"
import * as Sentry from "@sentry/vue"

const options = [
  {
    title: "Thème bleu foncé (DSFR)",
    label: "theme-default-dsfr",
    value: defaultDsfr,
  },
  {
    title: "Thème bleu clair",
    label: "theme-light-blue",
    value: lightBlue,
  },
  {
    title: "Thème Bordeaux Métropole",
    label: "theme-bordeaux-metropole",
    value: bordeauxMetropole,
  },
]

export default {
  install: (app) => {
    const styleElement = document.createElement("style")
    document.head.appendChild(styleElement)

    app.config.globalProperties.$theme = {
      current: "theme-default-dsfr",
      options,
      update(newThemeLabel) {
        if (!options.find((option) => option.label === newThemeLabel)) {
          Sentry.captureMessage(`Invalid theme label ${newThemeLabel}`)
          return
        }
        app.config.globalProperties.$theme.current = newThemeLabel
        styleElement.textContent = options.find(
          (option) => option.label === newThemeLabel
        )?.value
      },
    }
  },
}
