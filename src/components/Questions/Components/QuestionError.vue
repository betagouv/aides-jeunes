<template>
  <div class="alert alert-warning">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "QuestionError",
}
</script>

<style scoped>
.alert-warning {
  background-color: #ffe08a;
  border-radius: 0.375em;
  position: relative;
  padding: 1.25rem 2.5rem 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
}
</style>
