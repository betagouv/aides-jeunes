<template>
  <div class="simulation">
    <div class="main">
      <router-view/>
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
</style>
