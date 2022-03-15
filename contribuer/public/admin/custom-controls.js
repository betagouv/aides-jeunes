const NumberControl = CMS.getWidget("number").control
const StringControl = CMS.getWidget("string").control

class CustomNumberControl extends NumberControl {
  constructor(props) {
    super(props)
  }
  preventScroll = (e) => {
    e.target.blur()
  }
  render() {
    return h("div", { onWheel: this.preventScroll }, [
      { ...super.render(this.state) },
    ])
  }
}
CMS.registerWidget("number", CustomNumberControl)

class CustomStringControl extends StringControl {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
    }
  }
  format = (value) => {
    return value.trim().replace(/ +(?= )/g, "")
  }
  isValid = () => {
    if (
      this.props.field.get("required_group") &&
      !requiredGroupValidator(this.props.field.get("required_group"))
    ) {
      return false
    }

    if (this.props.value?.length > 0) {
      this.props.onChange(this.format(this.props.value))
    }
    return (
      !this.props.field.get("required", true) || this.props.value.length > 0
    )
  }

  render() {
    return h(
      "div",
      { "data-group-required": this.props.field.get("required_group") },
      [{ ...super.render(this.props) }]
    )
  }
}
CMS.registerWidget("string", CustomStringControl)
