import * as utils from "../../lib/utils"

export default {
  methods: {
    capitalize: (label) => utils.capitalize(label),
    isBoolean: (val) => typeof val === "boolean",
    isEmpty: (array) => array.length === 0,
    isNumber: (val) => typeof val === "number",
    isString: (val) => typeof val === "string",
  },
}
