const SelectOnClickDirective = (Vue) => {
  Vue.directive('selectOnClick', {
    bind: function(el) {
      el.myClickHandler = () => {
        el.select()
      }
      el.addEventListener('click', el.myClickHandler)
    },
    unbind: function(el) {
      el.removeEventListener('click', el.myClickHandler)
    }
  })
}

export default SelectOnClickDirective
