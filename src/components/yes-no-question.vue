<template>
  <div v-if="slots.default || slots.help" :data-testid="id">
    <component
      :is="htmlHeading"
      :id="id"
      role="heading"
      aria-level="2"
      class="fr-text--lg fr-text--regular"
    >
      <slot />
    </component>
    <slot name="help" />
    <div class="fr-container fr-px-0">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-6">
          <div class="fr-radio-group fr-radio-rich fr-mb-2w fr-mt-1w">
            <input
              :id="`yes-${uniqueFieldName}`"
              v-model="model"
              type="radio"
              :value="true"
              :name="uniqueFieldName"
              :aria-labelledby="
                id ? `${id} label-yes-${uniqueFieldName}` : null
              "
            />
            <label
              :id="`label-yes-${uniqueFieldName}`"
              :for="`yes-${uniqueFieldName}`"
              class="fr-label"
            >
              Oui
            </label>
          </div>
          <div class="fr-radio-group fr-radio-rich fr-mb-2w fr-mt-1w">
            <input
              :id="`no-${uniqueFieldName}`"
              v-model="model"
              type="radio"
              :value="false"
              :name="uniqueFieldName"
              :aria-labelledby="id ? `${id} label-no-${uniqueFieldName}` : null"
            />
            <label
              :id="`label-no-${uniqueFieldName}`"
              :for="`no-${uniqueFieldName}`"
              class="fr-label"
            >
              Non
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="fr-radio-group fr-radio-rich fr-mb-2w fr-mt-1w">
      <input
        :id="`yes-${uniqueFieldName}`"
        v-model="model"
        type="radio"
        :value="true"
        :name="uniqueFieldName"
      />
      <label :for="`yes-${uniqueFieldName}`" class="fr-label"> Oui </label>
    </div>
    <div class="fr-radio-group fr-radio-rich fr-mb-2w fr-mt-1w">
      <input
        :id="`no-${uniqueFieldName}`"
        v-model="model"
        type="radio"
        :value="false"
        :name="uniqueFieldName"
      />
      <label :for="`no-${uniqueFieldName}`" class="fr-label"> Non </label>
    </div>
  </div>
</template>

<script lang="ts">
import { useSlots } from "vue"
export default {
  name: "YesNoQuestion",
  props: {
    modelValue: [Boolean, Number],
    htmlHeading: {
      type: String,
      default: "h2",
    },
    id: String,
  },
  emits: ["update:modelValue"],
  data: function () {
    const uniqueFieldName = `field.${Math.random().toString(36).slice(2)}`
    return {
      uniqueFieldName,
      slots: useSlots(),
    }
  },
  computed: {
    model: {
      get: function () {
        return this.modelValue
      },
      set: function (value) {
        this.$emit("update:modelValue", value)
      },
    },
  },
}
</script>
