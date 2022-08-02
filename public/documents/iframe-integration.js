;(function () {
  "use strict"
  const script = document.currentScript
  const src = new URL(window.location.href.slice(0, -6) + "simulation")

  src.searchParams.set("iframe", true)
  src.searchParams.set(
    "integratorUrl",
    encodeURIComponent(window.location.href.toString())
  )

  const iframe = document.createElement("iframe")
  const iframeAttributes = {
    id: "simulateurEmbauche",
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

  script.before(iframe)
  window.addEventListener("message", function (evt) {
    if (evt.data.kind === "resize-height") {
      iframe.style.height = evt.data.value + "px"
    }
    if (evt.data.kind === "get-offset") {
      const iframePosition = iframe.getBoundingClientRect()
      iframe.contentWindow?.postMessage(
        { kind: "offset", value: Math.max(iframePosition.top * -1, 0) },
        "*"
      )
    }
  })
})()
