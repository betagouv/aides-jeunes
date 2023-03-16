<template>
  <component :is="layout">
    <BandeauDemo />
    <router-view />
    <fieldset class="fr-fieldset__content">
      <div
        class="fr-radio-group fr-radio-rich fr-mt-1w"
        v-for="item in $theme.values"
      >
        <input
          :key="item"
          :id="item"
          type="radio"
          name="theme"
          :value="item"
          @click="($event) => $theme.update($event.target.value)"
          v-model="$theme.current"
        /><label :for="item">{{ item }}</label>
      </div>
    </fieldset>
  </component>
</template>

<script>
import iFrameLayout from "@/components/iframe-layout.vue"
import BandeauDemo from "@/components/bandeau-demo.vue"

import context from "@/context/index.js"
import { persistDataOnSessionStorage, useStore } from "@/stores/index.ts"
const BaseLayout = context.BaseLayout

export default {
  name: "App",
  components: {
    BandeauDemo,
    BaseLayout,
    iFrameLayout,
  },
  setup() {
    const store = useStore()
    store.$onAction(persistDataOnSessionStorage)
    store.initialize()
    store.setOpenFiscaParameters()
    return {
      store,
    }
  },
  computed: {
    layout: function () {
      return this.store.inIframe ? "iFrameLayout" : "BaseLayout"
    },
  },
}
</script>
