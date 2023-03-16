import bordeauxMetropole from "@/styles/themes/bordeaux-metropole.css?inline"
import lightBlue from "@/styles/themes/light-blue.css?inline"
import defaultTheme from "@/styles/themes/default.css?inline"

const themes = {
  "bordeaux-metropole": bordeauxMetropole,
  "light-blue": lightBlue,
}

const ThemeService = {
  install: function (app) {
    const styleElement = document.createElement("style")
    document.head.appendChild(styleElement)

    app.config.globalProperties.$theme = {
      current: "default",
      values: [...Object.keys(themes), "default"],
      update(newTheme) {
        app.config.globalProperties.$theme.current = newTheme
        styleElement.textContent = themes[newTheme] || defaultTheme
      },
    }
  },
}

export default ThemeService
