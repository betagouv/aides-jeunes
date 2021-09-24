const SelectOnClickDirective = (app) => {
  app.directive("selectOnClick", {
    beforeMount: function (el) {
      el.myClickHandler = () => {
        el.select()
      }
      el.addEventListener("click", el.myClickHandler)
    },
    unmounted: function (el) {
      el.removeEventListener("click", el.myClickHandler)
    },
  })
}

export default SelectOnClickDirective
