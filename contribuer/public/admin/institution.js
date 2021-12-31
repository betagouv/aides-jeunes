const Relation = CMS.getWidget("relation")

class InstitutionControl extends Relation.control {
  constructor(props) {
    super(props)
    this.state = {
      initialOptions: [],
      filter: null,
      filterFunction: this.parseHitOptions.bind({}),
    }
    this.parseHitOptions = this._customParser
  }

  filterUpdate = (event) => {
    this.setState({ filter: event.target.value })
  }
  filterOptions = (hits) => {
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
  _customParser = (hits) => {
    return this.state.filterFunction(this.filterOptions(hits))
  }
  componentDidMount() {
    const { field } = this.props
    const defaultValue = field.get("filter").get("default", "*")
    this.setState({ filter: defaultValue })
  }
  render() {
    const { value, field, onChange, queryHits } = this.props

    const name = field.get("name")
    const categories = field
      .get("filter")
      .get("fields")
      .map((option) => {
        return {
          label: option.get("label"),
          value: option.get("value"),
        }
      })

    const style = h("link", { rel: "stylesheet", href: "/css/institution.css" })
    const node = super.render()

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
      categories.map((val, index) => {
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
    const container = h("div", { id: "aj-widget-institution" }, [
      { ...label },
      { ...filter },
    ])
    return h("div", {}, [{ ...style }, { ...container }, { ...node }])
  }
}
CMS.registerWidget("institution", InstitutionControl)
