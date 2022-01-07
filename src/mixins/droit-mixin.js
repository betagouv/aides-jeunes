import { capitalize } from "../lib/utils"

export default {
  methods: {
    capitalize: (label) => capitalize(label),
    isBoolean: (val) => typeof val === "boolean",
    isEmpty: (array) => array.length === 0,
    isNumber: (val) => typeof val === "number",
    isString: (val) => typeof val === "string",
  },
}
