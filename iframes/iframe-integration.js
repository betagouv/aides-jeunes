import { iframeResize } from "iframe-resizer"

const script = document.currentScript
const page = script.dataset.fromHome !== undefined ? "" : "simulation"
const src = new URL(`${process.env.BASE_URL}/${page}`)

src.searchParams.set("iframe", true)
src.searchParams.set("utm_source", `iframe@${window.location.hostname}`)
src.searchParams.set("utm_term", window.location.pathname)

if (script.dataset.withLogo !== undefined) {
  src.searchParams.set("data-with-logo", true)
}
if (script.dataset.fromHome !== undefined) {
  src.searchParams.set("data-from-home", true)
}
if (script.dataset.theme !== undefined) {
  src.searchParams.set("theme", script.dataset.theme)
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
for (const key in iframeAttributes) {
  iframe.setAttribute(key, iframeAttributes[key])
}

iframeResize({}, iframe)

let node = script.parentElement
while (node) {
  if (node.tagName === "BODY") {
    script.before(iframe)
    break
  } else if (node.tagName === "HTML") {
    const children = node.childNodes
    for (var i = 0; i < children.length; i++) {
      if (children.tagName === "BODY") {
        children.appendChild(iframe)
        break
      }
    }
    break
  }
  node = node.parentElement
}

console.error("iframe impossible to insert")
