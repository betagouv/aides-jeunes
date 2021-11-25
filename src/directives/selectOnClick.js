const SelectOnClickDirective = {
  beforeMount(el, binding, vnode) {
    el.myClickHandler = () => {
      el.select()
    }
    el.addEventListener("click", el.myClickHandler)
  },
  unmounted(el) {
    el.removeEventListener("click", el.myClickHandler)
  }
}

export default SelectOnClickDirective
