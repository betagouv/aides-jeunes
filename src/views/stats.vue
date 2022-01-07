<template>
  <article class="text container">
    <div class="aj-stats-container">
      <h1>Statistiques d'usage</h1>

      <div>
        Les
        <a
          href="http://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=9&period=day&date=yesterday"
        >
          statistiques d'usage de Mes Aides
        </a>
        sont publiques.
      </div>
      <div>
        Comprenez comment nous évaluons la
        <a
          href="https://beta.gouv.fr/2016/11/04/mes-aides-metriques-pirates-tunnel-conversion-public"
        >
          performance de Mes Aides
        </a>
        et comment nous
        <a
          href="https://beta.gouv.fr/2017/05/03/mes-aides-datascience-public.html"
        >
          améliorons notre simulateur
        </a>
        .
      </div>
      <div>
        Les informations suivantes peuvent être retrouvées sur un
        <a
          target="_blank"
          rel="noopener"
          href="https://betagouv.github.io/mes-aides-analytics/"
        >
          site dédié
        </a>
        .
      </div>

      <iframe
        id="iframe"
        src="https://betagouv.github.io/mes-aides-analytics/"
        scrolling="no"
        @load="iframeLoaded"
      />
    </div>
  </article>
</template>

<script>
import iFrameResize from "iframe-resizer/js/iframeResizer"

export default {
  name: "Stats",
  methods: {
    iframeLoaded() {
      iFrameResize({ log: false }, "#iframe")
    },
  },
}
</script>
