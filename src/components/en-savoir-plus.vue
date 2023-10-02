<template>
  <span v-if="text" class="fr-ml-1v" @mouseover="trackInterest()">
    &nbsp;
    <router-link
      :to="{ path: $route.path + '/en_savoir_plus' }"
      :data-text="text"
      class="fr-badge fr-badge--info"
      >en savoir plus
    </router-link>
  </span>
</template>

<script lang="ts">
import Hint from "@/lib/hint.js"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"

export default {
  name: "EnSavoirPlus",
  mixins: [StatisticsMixin],
  computed: {
    attribute: function () {
      return this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1)
    },
    source: function () {
      return this.$route.path
    },
    text: function () {
      return Hint.get(this.attribute, this.source)
    },
  },
  methods: {
    trackInterest() {
      this.sendEventToMatomo(
        EventCategory.Parcours,
        EventAction.EnSavoirPlus,
        this.$route.path
      )
    },
  },
}
</script>
