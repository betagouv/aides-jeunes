<template>
  <p class="fr-hint-text">Plusieurs choix possibles</p>
  <div
    v-for="(item, value) in itemsObject"
    :key="value"
    class="fr-checkbox-group"
  >
    <input
      :id="value"
      :data-testid="value"
      type="checkbox"
      :checked="item.checked"
      @input="update"
    />
    <label :for="value" class="fr-label">{{ item.label }}</label>
  </div>
</template>

<script lang="ts">
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
