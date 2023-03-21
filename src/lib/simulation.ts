interface CookieData {
  [key: string]: string
}

interface Simulation {
  getLatest: () => string
}

const Simulation: Simulation = {
  getLatest(): string {
    const cookies = document.cookie.split("; ")
    const data: CookieData = cookies.reduce((accum, pair) => {
      const [key, value] = pair.split("=", 2)
      accum[key] = value
      return accum
    }, {})
    return data.latestSimulation
  },
}

export default Simulation
