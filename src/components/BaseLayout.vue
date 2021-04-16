<template>
  <div class="aj-website">
      <div class="aj-website-content">
          <Header1J1S/>
          <slot></slot>
      </div>
      <FooterJ1S/>
  </div>
</template>

<script>
import Header1J1S from '@/components/Header1J1S'
import FooterJ1S from "./Footer1J1S";

export default {
  name: 'BaseLayout',
  components: {
      FooterJ1S,
      Header1J1S
  },
    created() {
        this.$router.onReady(() => {
            if (this.$route.query.debug === 'parcours') {
                this.$store.dispatch('setDebug', true)
            }
        })
    }
}
</script>
