<template>
  <div v-if="afficheBandeau" class="bandeau-demo-wrapper">
    <a class="bandeau-demo" target="_blank" rel="noopener" :href="link">
      Démo
    </a>
    <a v-if="benefitId" class="lien-debug" :href="benefitLink"
      >Accéder à l'aide créée</a
    >
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "BandeauDemo",
  data: function () {
    return {
      benefitId: null,
      benefitLink: null,
    }
  },
  computed: {
    afficheBandeau() {
      return true || process.env.VUE_APP_CONTEXT === "deploy-preview"
    },
    link() {
      return process.env.VUE_APP_PR_URL
    },
  },
  mounted: async function () {
    let pr = "pull/2530/head".split("/")
    if (process.env.VUE_APP_NETLIFY_PR !== "undefined") {
      pr = process.env.VUE_APP_NETLIFY_PR.split("/")
    }
    if (pr.length < 3) return
    const url = `https://api.github.com/repos/betagouv/aides-jeunes/pulls/${pr[1]}/files`
    //process.env.VUE_APP_NETLIFY_PR
    //return "/simulation/resultats?debug"
    ///simulation/resultats?debug=aide-nationale-au-brevet-daptitude-aux-fonctions-danimateur-bafa
    //return process.env.VUE_APP_NETLIFY_PR
    axios
      .get(url)
      .then((response) => {
        console.log("ok", response)
        for (let entry of response.data) {
          if (entry.filename.match(/(\.yml|.yaml)$/i)) {
            this.benefitId = entry.filename
          }
        }
        return
      })
      .catch((e) => {
        console.log("nok", e)
        return
      })
  },
}
</script>

<style lang="scss" scoped>
.bandeau-demo-wrapper {
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  width: 160px;
  height: 160px;
  pointer-events: none;

  .bandeau-demo {
    position: absolute;
    right: -39px;
    top: 23px;
    background: #5770be;
    background: var(--theme-primary);
    padding: 8px 48px;
    border-radius: 0;
    font-weight: 700;
    font-size: 24px;
    color: white;
    transform: rotate(45deg);
    pointer-events: all;
  }

  .lien-debug {
    position: fixed;
    inset: auto 30px 50px auto;
    display: block;
    background: #5770be;
    padding: 5px 10px;
    border-radius: 15px;
    color: #ffffff;
    z-index: 5000000;
    pointer-events: all;
    border: 1px solid #ffffff11;
  }
}
</style>
