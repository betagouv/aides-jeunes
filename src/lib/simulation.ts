export default {
  getLatest: function (): string | undefined {
    return document.cookie
      .split("; ")
      .reduce<Record<string, string>>((accum, pair) => {
        const [key, value] = pair.split("=", 2)
        accum[key] = value
        return accum
      }, {})?.lastestSimulation
  },
}
