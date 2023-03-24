// import { iframeResize } from "iframe-resizer"

const script = document.currentScript
const page = script.getAttribute("data-from-home") !== null ? "" : "simulation"
const src = new URL(`${process.env.BASE_URL}/${page}`)

src.searchParams.set("iframe", true)
src.searchParams.set(
  "integratorUrl",
  encodeURIComponent(window.location.href.toString())
)
if (script.getAttribute("data-with-logo") !== null) {
  src.searchParams.set("data-with-logo", true)
}

const currentScript = document.currentScript
let selectedTheme = "theme-default-dsfr"
if (
  currentScript &&
  currentScript.attributes &&
  currentScript.attributes.length > 0
) {
  const themeAttribute = Array.from(currentScript.attributes).find((attr) =>
    attr.name.startsWith("theme-")
  )
  if (themeAttribute) {
    selectedTheme = themeAttribute.name
  }
}
src.searchParams.set(selectedTheme, true)

const iframe = document.createElement("iframe")
const iframeAttributes = {
  id: "simulateur",
  src: src.toString(),
  title: process.env.IFRAME_TITLE,
  style: "border: none; width: 100%; display: block; height: 700px",
  allow: "clipboard-write",
  allowfullscreen: true,
  webkitallowfullscreen: true,
  mozallowfullscreen: true,
}
for (const key in iframeAttributes) {
  iframe.setAttribute(key, iframeAttributes[key])
}

// iframeResize({}, iframe)

script.before(iframe)
