<template>
  <div class="simulation">
    <div class="main">
      <router-view/>
      <div class="actions">
        <button class="button large">OK</button>
      </div>
    </div>
    <div class="separator" />
    <SimulationProgress />
  </div>
</template>

<script>
import SimulationProgress from '@/components/Progress'

export default {
  name: 'Simulation',
  components: {
    SimulationProgress,
  },
}
</script>

<style type="text/css" scoped>
.simulation {
  display: flex;
  flex-direction: row-reverse;
}

.simulation > * {
  padding: 1em;
}

.separator {
  flex-grow: 2;
}

.main {
  flex-grow: 20;
}

.actions {
  display: flex;
}
</style>
