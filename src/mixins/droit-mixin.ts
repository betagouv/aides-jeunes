import { capitalize } from "@lib/utils.js"

export default {
  methods: {
    capitalize: (label: string) => capitalize(label),
    isBoolean: (val) => typeof val === "boolean",
    isEmpty: (array) => array.length === 0,
    isNumber: (val) => typeof val === "number",
    isString: (val) => typeof val === "string",
  },
}
