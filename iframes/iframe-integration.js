import { iframeResize } from "iframe-resizer"

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

if (script.getAttribute("theme-default-dsfr") !== null) {
  src.searchParams.set("theme-default-dsfr", true)
}

if (script.getAttribute("theme-light-blue") !== null) {
  src.searchParams.set("theme-light-blue", true)
}

if (script.getAttribute("theme-bordeaux-metropole") !== null) {
  src.searchParams.set("theme-bordeaux-metropole", true)
}

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
for (var key in iframeAttributes) {
  iframe.setAttribute(key, iframeAttributes[key])
}
iframeResize({}, iframe)

script.before(iframe)
