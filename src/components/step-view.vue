<template
  ><div>
    {{ label(step) }}
  </div></template
>

<script>
function counter({ steps }) {
  return steps ? steps.map(counter).reduce((a, v) => a + v, 0) : 1
}

export default {
  name: "StepView",
  props: {
    step: Object,
    depth: Number,
  },
  setup(props) {
    return {
      step: props.step,
      open: !props.depth,
    }
  },
  methods: {
    s_counter(s) {
      return counter(s)
    },
    label(s) {
      const count = counter(s)
      return s.steps
        ? s.steps.length == 1
          ? s.steps[0].path
          : `${s.steps[0].path} (+${count - 1})`
        : s.path
    },
  },
}
</script>
