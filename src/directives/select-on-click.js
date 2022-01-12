const SelectOnClickDirective = {
  beforeMount(el) {
    el.myClickHandler = () => {
      el.select()
    }
    el.addEventListener("click", el.myClickHandler)
  },
  unmounted(el) {
    el.removeEventListener("click", el.myClickHandler)
  },
}

export default SelectOnClickDirective
