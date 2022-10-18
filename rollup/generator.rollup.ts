import institutions from "./institutions.js"
import benefits from "./benefits.js"

export default {
  name: "data generator",
  resolveId: (source) => {
    if (
      source === "generator:institutions" ||
      source === "generator:benefits"
    ) {
      return source
    }
    return null
  },
  load: async (id) => {
    if (id === "generator:institutions") {
      return `export default ${JSON.stringify(institutions)}`
    } else if (id === "generator:benefits") {
      return `export default ${JSON.stringify(benefits)}`
    }
  },
}
