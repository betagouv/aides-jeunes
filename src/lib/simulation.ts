interface CookieData {
  [key: string]: string
}

interface Simulation {
  getLatest: () => string
}

const Simulation = {
  getLatest(): Simulation | null {
    const cookies = document.cookie.split("; ")
    const data: CookieData = cookies.reduce((accum, pair) => {
      const [key, value] = pair.split("=", 2)
      accum[key] = value
      return accum
    }, {})
    if (!data.latestSimulation) {
      return null
    }
    return { getLatest: () => data.latestSimulation }
  },
}

export default Simulation
