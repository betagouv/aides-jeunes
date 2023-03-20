<template>
  <component :is="layout">
    <BandeauDemo />
    <router-view />
    <fieldset class="fr-fieldset__content">
      <div
        v-for="item in $theme.values"
        :key="item"
        class="fr-radio-group fr-radio-rich fr-mt-1w"
      >
        <input
          :id="item"
          v-model="$theme.current"
          type="radio"
          name="theme"
          :value="item"
          @click="($event) => $theme.update($event.target.value)"
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
