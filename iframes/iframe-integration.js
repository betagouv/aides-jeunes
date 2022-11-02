import { iframeResize } from "iframe-resizer"

const script = document.currentScript
const page = script.getAttribute("splash") !== null ? "" : "simulation"
const src = new URL(`${process.env.BASE_URL}/${page}`)

src.searchParams.set("iframe", true)
src.searchParams.set(
  "integratorUrl",
  encodeURIComponent(window.location.href.toString())
)
if (script.getAttribute("institutional") !== null) {
  src.searchParams.set("institutional", true)
}

const iframe = document.createElement("iframe")
const iframeAttributes = {
  id: "simulateur",
  src: src.toString(),
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
