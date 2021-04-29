<template>
  <form @submit.prevent='onSubmit'>
    {{ fieldName }}{{ value }}
    <!-- questionType === boolean -->
    <YesNoQuestion v-if="questionType === 'boolean'"
        v-model="value"
    >
        <div v-html="question"></div>
    </YesNoQuestion>
    <!-- questionType === enum -->
    <fieldset v-if="questionType === 'enum'">
        <legend>
        <h2 class="aj-question"><div v-html="question"></div></h2></legend>
        <div class="aj-selection-wrapper" v-for="item in items" :key="item.value">
        <input :id="item.value" type="radio" :name="fieldName" :value="item.value" v-model="value"/>
        <label :for="item.value">
            {{ item.label }}
        </label>
        </div>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { autoSubmitMixin } from '@/mixins/AutoSubmit'
import YesNoQuestion from '../../components/YesNoQuestion.vue'

export default {
  name: 'SimulationParentProperty',
  components: {
    Actions,
    YesNoQuestion,
  },
  data: function({ fieldName }) {
    const id = this.$route.params.id
    const parents = {
      ...this.$store.getters.getParents || {}
    }
    const value = parents[fieldName]
    return {
        error: false,
        parents,
        id,
        value,
    }
  },
  mixins: [autoSubmitMixin('value')],
  props: {
      fieldName: String,
      question: String,
      // updateMethod: String,
      optional: Boolean,
      items: Array,
      questionType: String,
  },
  computed: {
    property: function() {
      return this.$route.params.property
    },
    subproperty: function() {
      return this.$route.params.subproperty
    },
  },
  methods: {
    requiredValueMissing: function() {
        const hasError = !this.optional && this.value === undefined
        this.$store.dispatch('updateError', hasError && 'Ce champ est obligatoire.')
        return hasError
    },
    onSubmit: function() {
        if (this.requiredValueMissing()) {
            return
        }
        this.parents[this.fieldName] = this.value
        this.$store.dispatch('updateParents', this.parents)
        this.$push()
    }
  }
}
</script>
