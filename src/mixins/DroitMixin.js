import { capitalize } from "../lib/Utils"

export default {
  methods: {
    isEmpty: (array) => array.length === 0,
    isBoolean: (val) => typeof val === "boolean",
    isNumber: (val) => typeof val === "number",
    isString: (val) => typeof val === "string",
    capitalize: (label) => capitalize(label),
  },
}
