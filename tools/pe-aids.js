import axios from "axios"
import fs from "fs"
import xlsx from "xlsx"
import benefitData from "../dist-server/data/all.js"

const institutionCodeMap = {
  code_insee: {},
  code_siren: {},
}

for (const id in benefitData.institutionsMap) {
  const i = benefitData.institutionsMap[id]
  const codes = ["code_siren"]
  if (i.code_insee) {
    codes.unshift("code_insee")
  }
  codes.forEach((c) => {
    const key = `${i.type}_${i[c]}`
    console.log(key)
    if (institutionCodeMap[c][key]) {
      throw new Error(`institutionCodeMap.${c}[key] already exists ${key}`)
    }
    institutionCodeMap[c][key] = i
  })
}

console.log(institutionCodeMap)
process.exit()
//console.log(benefitData.all)

//console.log(data)
/*axios
  .get(
    "https://docs.google.com/spreadsheets/d/1BKdPOH9WDU13sB8jopWJxdaggjU-9NkCpRaIRIC1RQQ/export?exportFormat=xlsx",
    { responseType: "arraybuffer" }
  )
  .then((response) => {
    fs.writeFileSync('data.xlsx', response.data)
  })
*/

const PeData = JSON.parse(fs.readFileSync("./aids.json", "utf-8"))

//console.log(PeData.filter(s => s.id == "rec0Y0QgHZkQ8ituP"))

Promise.resolve(fs.readFileSync("data.xlsx"))
  .then((d) => xlsx.read(d))
  .then((d) => {
    return {
      organisms: xlsx.utils.sheet_to_json(
        d.Sheets["Correspondance organismes"]
      ),
      aids: xlsx.utils.sheet_to_json(d.Sheets["Correspondance aides"]),
    }
  })
  .then((d) => {
    // Organisms
    const keyedOrganisms = d.organisms.reduce((a, v) => {
      a[v.slug]
      return a
    }, {})

    // Aids
    const keyedAids = d.aids.reduce((a, v) => {
      a[v.idPe] = a[v.idPe] || { matches: {}, failed: {}, awaiting: {} }
      const item = a[v.idPe]
      const dest =
        v.match === true
          ? item.matches
          : v.match === false
          ? item.failed
          : item.awaiting
      dest[v.idAj] = 1
      return a
    }, {})

    PeData.forEach((i) => {
      i.mapping = keyedAids[i.id] = {}
    })
    const todo = PeData.filter((a) => !Object.keys(a.mapping || {}).length)

    const worksheet = xlsx.utils.json_to_sheet(
      todo.map(({ id, url }) => {
        return { id, url }
      })
    )
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, "OK", true)
    xlsx.writeFile(workbook, "matches-worksheet2.xlsx")
  })

/*
axios('https://mes-aides.pole-emploi.fr/api/aids')
.then(r => r.data)
.then(d => fs.writeFileSync('aids.json', JSON.stringify(d, null, 2)))

*/
