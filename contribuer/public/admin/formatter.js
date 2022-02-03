const StringControl = CMS.getWidget("string").control

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
    if (this.props.value?.length > 0) {
      this.props.onChange(this.format(this.props.value))
    }
    return (
      !this.props.field.get("required", true) || this.props.value.length > 0
    )
  }
}
CMS.registerWidget("string", CustomStringControl)
