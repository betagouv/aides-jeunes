<template>
  <fieldset>
    <div
      v-for="(item, value) in this.itemsList"
      :key="value"
      class="aj-selection-wrapper"
    >
      <input
        type="checkbox"
        :id="value"
        @input="this.update"
        :checked="item.checked"
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
      default: [],
    },
    items: [Object],
  },
  emits: ["update:modelValue"],
  data() {
    return {
      itemsList: this.generateAnswers(this.items),
    }
  },
  methods: {
    generateAnswers(items) {
      const itemsList = {}
      for (let key in items) {
        itemsList[items[key].value] = {
          label: items[key].label,
          checked: this.modelValue.includes(items[key].value),
        }
      }
      return itemsList
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
