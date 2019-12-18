<template>
  <article class="text container">

  <h1>Statistiques d'usage</h1>

  <p>Les <a href="http://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=9&period=day&date=yesterday">statistiques d'usage de Mes Aides</a> sont publiques.</p>
  <p>Comprenez comment nous évaluons la <a href="https://beta.gouv.fr/2016/11/04/mes-aides-metriques-pirates-tunnel-conversion-public">performance de Mes Aides</a> et comment nous <a href="https://beta.gouv.fr/2017/05/03/mes-aides-datascience-public.html">améliorons notre simulateur</a>.</p>

  <p>Les informations suivantes peuvent être retrouvées sur un
    <a
        target="_blank"
        rel="noopener"
        href="https://betagouv.github.io/mes-aides-analytics/" 
    >site dédié</a>.
    </p>

  <iframe
    id="iframe"
    style="border: none; display: block; margin: 10px auto; min-height: 700px"
    src="https://betagouv.github.io/mes-aides-analytics/"
    width="140%"
    scrolling="no"
    v-on:load="iframeLoaded"
  ></iframe>
  </article>
</template>

<script>
import iFrameResize from 'iframe-resizer/js/iframeResizer'

export default {
  name: 'Stats',
  methods: {
    iframeLoaded () {
      iFrameResize({log: true}, '#iframe')
    }
  }
}
</script>
