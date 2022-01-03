const Relation = CMS.getWidget("relation")

class InstitutionControl extends Relation.control {
  constructor(props) {
    super(props)
    this.state = {
      initialOptions: [],
      filter: null,
      filterFunction: this.parseHitOptions.bind(this),
      categories: [],
    }
    this.parseHitOptions = this._customParser
  }

  filterUpdate = (event) => {
    this.setState({ filter: event.target.value })
    this.filterSelectedValues()
    // force update is a bad practice but mandatory in this case
    this.forceUpdate()
  }
  filterOptions = (hits) => {
    hits = [...hits].sort((a, b) => a.data.name.localeCompare(b.data.name))
    return this.state.filter == "*"
      ? hits
      : hits.filter((institution) => {
          return (
            (institution.data.type &&
              institution.data.type == this.state.filter) ||
            (!this.state.filter && !institution.data.type)
          )
        })
  }
  filterSelectedValues = () => {
    // disable current option(s) if not available anymore
    this.setState({
      initialOptions: this.state.initialOptions.filter((option) => {
        return (
          this.state.filter == "*" ||
          (this.state.filter == "" && !option.type) ||
          this.state.filter == option.type
        )
      }),
    })
  }
  _customParser = (hits) => {
    const filtered = this.filterOptions(hits)
    this.filterSelectedValues()
    return this.state.filterFunction(filtered)
  }
  componentDidMount() {
    const defaultValue = this.props.field.get("filter").get("default", "*")
    this.setState({
      filter: defaultValue,
      categories: this.props.field
        .get("filter")
        .get("fields")
        .map((option) => {
          return {
            label: option.get("label"),
            value: option.get("value"),
          }
        })
        .unshift({ value: "*", label: "Tous" }),
    })
  }
  render() {
    const { value, field, onChange } = this.props

    const name = field.get("name")
    const style = h("link", { rel: "stylesheet", href: "/css/institution.css" })
    const node = super.render(this.state)

    const label = h(
      "label",
      { for: `filter-${name}` },
      `${field.get("filter").get("label")}`
    )
    const filter = h(
      "select",
      {
        id: `filter-${name}`,
        onChange: this.filterUpdate,
      },
      this.state.categories.map((val, index) => {
        return h(
          "option",
          {
            key: index,
            value: val["value"],
            selected:
              this.state.filter == val["value"] ? "selected" : undefined,
          },
          val["label"]
        )
      })
    )
    const container = h("div", { id: "aj-widget-form" }, [
      { ...label },
      { ...filter },
    ])
    return h("div", { id: "aj-widget-institution", key: this.state.filter }, [
      { ...style },
      { ...container },
      { ...node },
    ])
  }
}
CMS.registerWidget("institution", InstitutionControl)
