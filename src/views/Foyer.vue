<template>
  <div class="main">
    <div class="progress" v-bind:style="style" />
    <div v-if="$store.state.message" class="main notification warning full-width" v-html="$store.state.message" />
    <div class="foyer">
      <div class="title">
        <h1 v-html="title" />
        <h2 v-if="canEdit" class="editor" aria-label="Modifier vos réponses">📝</h2>
      </div>
      <router-view />
    </div>
    <FoyerRecap />
  </div>
</template>

<script>
import _ from 'lodash'
import FoyerRecap from '@/components/FoyerRecap.vue'

function findSibling(route) {
  if (route.fullPath === '/foyer/enfants/ajouter'
    || route.name === 'enfants/modifier') {
    return '/foyer/enfants'
  }

  if (route.fullPath === '/foyer/ressources/patrimoine'
    || route.fullPath === '/foyer/ressources/fiscales') {
    return '/foyer/resultat'
  }
}

export default {
  name: 'foyer',
  components: {
    FoyerRecap
  },
  computed: {
    canEdit: function() {
      return false
    },
    progress: function() {
      return (this.step*2-1)/(2*this.total-1)
    },
    style: function() {
      return { width: `${100*this.progress}%` }
    },
    steps: function() {
      const start = '/foyer/demandeur'
      return [start].concat(this.$state.full(start, this.$store.state.situation))
    },
    total: function() {
      return this.steps.length
    },
    step: function() {
      let idx = _.indexOf(this.steps, this.$route.fullPath)
      if (idx >= 0) {
        return idx+1
      }
      idx = _.findIndex(this.steps, { name: this.$route.name, params: this.$route.params })
      if (idx >= 0) {
        return idx+1
      }

      idx = _.indexOf(this.steps, findSibling(this.$route))
      if (idx >= 0) {
        return idx+1
      }

      this.$matomo && this.$matomo.trackEvent('General', 'Progress error', this.$route.fullPath)
      return this.total
    },
    title: function() {
      return this.$store.state.title
    }
  }
}
</script>

<style lang="scss">
.main {
  flex-grow: 1;
  background-color: whitesmoke;
}

.main.notification {
  display: block;
}

.foyer {
  padding: 1em;
  max-width: 45em;
  margin: 0 auto;
}

pre {
  text-align: left;
  white-space: break-spaces;
  width: 100%
}

h1[tabindex="-1"] {
  outline: none;
}

a.button:focus,
button.button:focus,
input[type="submit"]:focus,
input[type="button"]:focus {
  background: #003b80;
  background: var(--theme-secondary-darken);
}

.progress {
  height: 0.7em;
  background-color: #003b80;
  transition: all 0.5s;
}

.title {
  display: flex;
  justify-content: space-between;
}

.editor {
  margin-top: 3px;
}

</style>
