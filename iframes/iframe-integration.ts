import iframeResize from "@iframe-resizer/parent"

// Ce fichier est empaqueté par webpack sans loader TypeScript : il est parsé
// comme du JavaScript, donc écrit sans annotation de type.

// Marge de déclenchement : l'iframe démarre avant d'entrer dans le champ de
// vision, pour qu'un utilisateur qui fait défiler ne perçoive pas d'attente.
const ROOT_MARGIN = "400px"

function buildSource(script) {
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

  return src.toString()
}

function buildIframe() {
  const iframe = document.createElement("iframe")
  const iframeAttributes = {
    id: "simulateur",
    title: process.env.IFRAME_TITLE,
    // La hauteur est posée dès l'insertion, avant le chargement : la mise en
    // page de l'hôte ne bouge pas quand le simulateur démarre.
    style: "border: none; width: 100%; display: block; height: 700px",
    allow: "clipboard-write",
    allowfullscreen: true,
    webkitallowfullscreen: true,
    mozallowfullscreen: true,
  }
  for (const key in iframeAttributes) {
    iframe.setAttribute(key, iframeAttributes[key])
  }
  return iframe
}

function insert(script, iframe) {
  if (script.parentElement && script.parentElement.tagName === "HEAD") {
    const body =
      script.parentElement.parentElement &&
      script.parentElement.parentElement.querySelector("body")
    if (body) {
      body.appendChild(iframe)
    }
    return
  }
  script.before(iframe)
}

function load(iframe, src) {
  if (iframe.src) {
    return
  }
  iframe.src = src
  iframeResize({ license: "GPLv3" }, iframe)
}

export function mountSimulator(script) {
  const iframe = buildIframe()
  const src = buildSource(script)
  insert(script, iframe)

  // Le simulateur est une application complète : la démarrer pour un visiteur
  // qui ne descendra jamais jusqu'à elle coûte une quarantaine de requêtes pour
  // rien. `data-eager` rétablit le chargement immédiat.
  const eager =
    script.dataset.eager !== undefined || !("IntersectionObserver" in window)

  if (eager) {
    load(iframe, src)
    return iframe
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect()
        load(iframe, src)
      }
    },
    { rootMargin: ROOT_MARGIN },
  )
  observer.observe(iframe)

  return iframe
}

if (document.currentScript) {
  mountSimulator(document.currentScript)
}
