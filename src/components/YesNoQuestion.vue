<template>
  <fieldset>
    <legend>
      <component :is="htmlHeading" class="aj-question">
        <slot />
      </component>
      <slot name="help" />
    </legend>
    <div class="aj-selections">
      <div class="aj-selection-wrapper">
        <input
          :id="'yes-' + uniqueFieldName"
          v-model="model"
          type="radio"
          :value="true"
          :name="uniqueFieldName"
        />
        <label :for="'yes-' + uniqueFieldName">Oui</label>
      </div>
      <div class="aj-selection-wrapper">
        <input
          :id="'no-' + uniqueFieldName"
          v-model="model"
          type="radio"
          :value="false"
          :name="uniqueFieldName"
        />
        <label :for="'no-' + uniqueFieldName">Non</label>
      </div>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: "YesNoQuestion",
  props: {
    modelValue: [Boolean, Number],
    htmlHeading: {
      type: String,
      default: "h2",
    },
  },
  emits: ["update:modelValue"],
  data: function () {
    const uniqueFieldName = "field." + Math.random().toString(36).slice(2)
    return {
      uniqueFieldName,
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
