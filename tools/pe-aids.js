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
  if (i.code_insee) {
    const key = `${i.type}_${i.code_insee}`
    if (institutionCodeMap.code_insee[key]) {
      /*throw new Error*/ console.warn(
        `institutionCodeMap.code_insee[key] already exists ${key} ${i.id}`
      )
    }
    institutionCodeMap.code_insee[key] = i
  } else {
    const key = i.code_siren
    if (institutionCodeMap.code_siren[key]) {
      /*throw new Error*/ console.warn(
        `institutionCodeMap.code_siren[key] already exists ${key} ${i.id}`
      )
    }
    institutionCodeMap.code_siren[key] = i
  }
}

//console.log(benefitData.all)
const PeData = JSON.parse(fs.readFileSync("./aids.json", "utf-8"))
//console.log(PeData.filter(s => s.id == "rec0Y0QgHZkQ8ituP"))

//console.log(data)
axios
  .get(
    "https://docs.google.com/spreadsheets/d/1BKdPOH9WDU13sB8jopWJxdaggjU-9NkCpRaIRIC1RQQ/export?exportFormat=xlsx",
    { responseType: "arraybuffer" }
  )
  .then((response) => response.data)
  .then((data) => fs.writeFileSync("data.xlsx", data))
  //  Promise.resolve()
  .then(() => fs.readFileSync("data.xlsx"))
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
    const workbook = xlsx.utils.book_new()

    // Organisms
    const keyedOrganisms = d.organisms.reduce((a, v) => {
      a[v.slug] = a[v.slug] || {
        matches: {},
        failed: {},
        awaiting: {},
        mapping: undefined,
      }
      const item = a[v.slug]
      const dest =
        v.match === true
          ? item.matches
          : v.match === false
          ? item.failed
          : item.awaiting
      let matchingInstitution
      let key
      if (["commune", "departement", "region"].indexOf(v.type) >= 0) {
        key = `${v.type}_${v.code}`
        matchingInstitution = institutionCodeMap.code_insee[key]
      } else {
        key = v.code
        matchingInstitution = institutionCodeMap.code_siren[key]
      }

      if (dest === item.matches) {
        if (Object.keys(dest).length) {
          console.warn("doublon " + v.slug + " " + JSON.stringify(item))
        }
        item.mapping = matchingInstitution
      }
      dest[matchingInstitution?.id || key] = 1
      return a
    }, {})

    const PeOrganismMap = {}
    PeData.forEach((a) => {
      PeOrganismMap[a.organism.slug] = PeOrganismMap[a.organism.slug] || {
        v: a.organism,
        aids: [],
        mapping: keyedOrganisms[a.organism.slug],
      }
      PeOrganismMap[a.organism.slug].aids.push(a)
    })
    const organismData = Object.values(PeOrganismMap)
    organismData.forEach((o) => {
      o.attempts = keyedOrganisms[o.v.slug]
      o.mapping = o.attempts?.mapping?.id
    })
    const unmappedOrganism = organismData.filter((o) => !o.mapping)
    // Build candidates
    // Limit candidates
    const organismWorksheet = xlsx.utils.json_to_sheet(
      unmappedOrganism.map((o) => {
        return { idPe: o.v.slug, type: "", code: "", match: "" }
      })
    )
    xlsx.utils.book_append_sheet(
      workbook,
      organismWorksheet,
      "Organismes",
      true
    )
    //xlsx.writeFile(workbook, "matches-worksheet4.xlsx")

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
      if (dest === item.matches) {
        if (Object.keys(dest).length) {
          console.warn("doublon " + v.idPe + " " + JSON.stringify(item))
        }
      }
      dest[v.idAj] = 1
      return a
    }, {})

    PeData.forEach((i) => {
      i.mapping = keyedAids[i.id] || {}
    })
    const todo = PeData.filter(
      (a) => !Object.keys(a.mapping?.matches || {}).length
    )

    // Build candidates
    todo.forEach((i) => {
      i.institution = keyedOrganisms[i.organism.slug]?.matches
    })

    const all_attempts = todo
      .map((i) => {
        return (i.institution?.benefitsIds || [""]).map((e) => {
          return { ...i, idAJ: e }
        })
      })
      .reduce((a, v) => {
        v.forEach((i) => {
          a.push(i)
        })
        return a
      }, [])

    // Limit to new candidates only
    const attempts_to_show = all_attempts.filter((a) => {
      return true //(!a?.mapping?.failed || !a?.mapping?.failed[a.idAJ]) && (!a?.mapping?.awaiting || !a?.mapping?.awaiting[a.idAJ])
    })
    console.log(attempts_to_show.length)

    const aidWorksheet = xlsx.utils.json_to_sheet(
      attempts_to_show.map(({ id, url, idAJ }) => {
        return { idPe: id, url, idAJ, match: "" }
      })
    )
    xlsx.utils.book_append_sheet(workbook, aidWorksheet, "Aides", true)
    xlsx.writeFile(workbook, "matches-worksheet5.xlsx")
  })

/*
axios('https://mes-aides.pole-emploi.fr/api/aids')
.then(r => r.data)
.then(d => fs.writeFileSync('aids.json', JSON.stringify(d, null, 2)))

*/
