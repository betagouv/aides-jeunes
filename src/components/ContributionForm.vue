<template>
  <div class="form__group contribution-block">
    <h2 class="aj-question"
      >Cette question est-elle pertinente pour votre aide ?</h2
    >
    <div class="help"
      >Si cette question est pertinente merci de renseigner une valeur (vraie ou
      fausse). Elle sera utilisée pour tester votre formule. Si cette question
      ne vous intéresse pas vous pouvez passer directement à la question
      suivante.</div
    >
    <div class="aj-selections">
      <div class="aj-selection-wrapper">
        <input
          id="contribution-checkbox"
          type="checkbox"
          :checked="value"
          @change="onChange"
        />
        <label for="contribution-checkbox">
          Cette question est pertinente
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContributionForm",
  props: ["value"],
  methods: {
    onChange() {
      this.$emit("input", !this.value)
    },
  },
}
</script>

<style scoped lang="scss">
.contribution-block {
  border: 1px solid var(--theme-primary);
  border-radius: 10px;
  padding: 10px;
  margin-top: 40px;

  .aj-selections {
    margin-top: 10px;
  }

  .help {
    font-style: italic;
  }
}
</style>
