const communesBase = require("@etalab/decoupage-administratif/data/communes.json")
const epci = require("@etalab/decoupage-administratif/data/epci.json")

//const rawData = require('./velo.json')
const rawData = require("./export_velo4.json")
const communes = communesBase.filter((c) => c.type == "commune-actuelle")

const communeMap = communes.reduce((a, c) => {
  a[c.code] = c
  c.epci = []
  return a
}, {})

epci.forEach((e) => {
  e.membres.forEach((m) => {
    communeMap[m.code]?.epci.push(e)
  })
})

const stats = {
  france: {},
  regions: {},
  departements: {},
  epcis: {},
}

const agg = [
  (r) => [stats.france],
  (r) => {
    const [dt, group, depcom] = r._id.split(";")
    if (!communeMap[depcom]) {
      console.log(r)
      return []
    }
    const regionCode = communeMap[depcom].region
    stats.regions[regionCode] = stats.regions[regionCode] || {}
    return [stats.regions[regionCode]]
  },
  (r) => {
    const [dt, group, depcom] = r._id.split(";")
    if (!communeMap[depcom]) {
      console.log(r)
      return []
    }
    const departementCode = communeMap[depcom].departement
    stats.departements[departementCode] =
      stats.departements[departementCode] || {}
    return [stats.departements[departementCode]]
  },
  (r) => {
    const [dt, group, depcom] = r._id.split(";")
    if (!communeMap[depcom]) {
      console.log(r)
      return []
    }
    const commune = communeMap[depcom]
    return commune?.epci.map((e) => {
      stats.epcis[e.code] = stats.epcis[e.code] || {}
      return stats.epcis[e.code]
    })
  },
]

rawData /*.slice(0, 10)*/
  .forEach((row) => {
    // TODO dt, depcom, groups
    agg.forEach((a) => {
      const elements = a(row)

      elements.forEach((element) => {
        const [dt, group, depcom] = row._id.split(";")
        const groups = [group]
        //console.log([dt, depcom, groups], row.value)

        element[dt] = element[dt] || {
          raw: {},
          split: {},
          selectionCount: {},
          splitByCount: {},
          total: 0,
        }
        groupsLabel = groups.join(";")

        items = groups[0].split(",").filter((i) => i.length || i == "#N/A")
        items.forEach((i) => {
          element[dt].split[i] = (element[dt].split[i] || 0) + row.value
        })
        element[dt].selectionCount[items.length] =
          (element[dt].selectionCount[items.length] || 0) + row.value
        element[dt].splitByCount[items.length] =
          element[dt].splitByCount[items.length] || {}
        items.forEach((i) => {
          element[dt].splitByCount[items.length][i] =
            (element[dt].splitByCount[items.length][i] || 0) + row.value
        })

        //element[dt].raw[row._id] = (element[dt].raw[row._id] || 0 ) + row.value
        element[dt].total += row.value
      })
    })
  })

console.log(JSON.stringify(stats, null, 2))
