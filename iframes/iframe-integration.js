import { iframeResize } from "iframe-resizer"

const script = document.currentScript
const page = script.dataset.fromHome !== undefined ? "" : "simulation"
const src = new URL(`${process.env.BASE_URL}/${page}`)

src.searchParams.set("iframe", true)
src.searchParams.set(
  "integratorUrl",
  encodeURIComponent(window.location.href.toString())
)

if (script.dataset.withLogo !== undefined) {
  src.searchParams.set("data-with-logo", true)
}
if (script.dataset.fromHome !== undefined) {
  src.searchParams.set("data-from-home", true)
}

const selectedTheme =
  localStorage.getItem("theme") || script.dataset.theme || "default-dsfr"
src.searchParams.set("theme", selectedTheme)

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

iframeResize({}, iframe)

script.before(iframe)
