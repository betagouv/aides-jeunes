<template>
  <fieldset>
    <div
      v-for="(item, value) in itemsObject"
      :key="value"
      class="aj-selection-wrapper"
    >
      <input
        :id="value"
        type="checkbox"
        :checked="item.checked"
        @input="update"
      />
      <label :for="value">{{ item.label }}</label>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: "MultipleAnswers",
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    items: [Object],
  },
  emits: ["update:modelValue"],
  data() {
    return {
      itemsObject: this.generateAnswers(this.items),
    }
  },
  methods: {
    generateAnswers(items) {
      const itemsObject = {}
      for (let key in items) {
        itemsObject[items[key].value] = {
          label: items[key].label,
          checked: this.modelValue.includes(items[key].value),
        }
      }
      this.$emit("update:modelValue", this.modelValue)
      return itemsObject
    },
    update(e) {
      if (!e.target.checked) {
        this.$emit(
          "update:modelValue",
          this.modelValue.filter((value) => value != e.target.id)
        )
      } else if (!this.modelValue.includes(e.target.id)) {
        this.$emit("update:modelValue", [...this.modelValue, e.target.id])
      }
    },
  },
}
</script>
