const NumberControl = CMS.getWidget("number").control

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
