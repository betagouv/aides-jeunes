import iframeResize from "@iframe-resizer/parent"
const script = document.currentScript
const page = script.dataset.fromHome !== undefined ? "" : "simulation"
const src = new URL(`${process.env.BASE_URL}/${page}`)

src.searchParams.set("iframe", "true")
src.searchParams.set("utm_source", `iframe@${window.location.hostname}`)
src.searchParams.set("utm_term", window.location.pathname)
src.searchParams.set(
  "data-with-logo",
  (script.dataset.withLogo !== undefined).toString(),
)
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

if (script.parentElement.tagName === "HEAD") {
  const body = script.parentElement.parentElement.querySelector("body")
  if (body) {
    body.appendChild(iframe)
  }
} else {
  script.before(iframe)
}

iframeResize({ license: "GPLv3" }, iframe)
