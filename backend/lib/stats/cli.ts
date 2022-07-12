/* eslint-disable no-console */
import Promise from "bluebird"
import omit from "lodash/omit"
import fs from "fs/promises"
import mongodb from "./mongodb"

mongodb
  .connect()
  .then((db) => {
    const p = async (resolve, reject) => {
      db.collection("followups")
        .find({ "surveys.repliedAt": { $exists: true } })
        .toArray((err, items) => {
          if (err) {
            return reject(err)
          }
          const rows = []
          items.forEach((i) => {
            const b = {
              situation: i.situation,
              date: i.createdAt.toISOString().slice(0, 10),
            }

            i.surveys[0].answers.forEach((a) => {
              rows.push(Object.assign({}, omit(a, "_id"), b))
            })
          })

          resolve(rows)
        })
    }
    return p
  })
  .then(async (r) => {
    const csv = r.map((i) =>
      Object.values(i)
        .map((s) => `"${s}"`)
        .join(";")
    )
    csv.unshift("benefit;result;comment;id;date")
    return await fs.writeFile("data.csv", csv.join("\n"), "utf-8")

    //return fs.writeFileAsync('data.json', JSON.stringify(r, null, 2), 'utf-8')
  })
  .then((r) => {
    console.log(r)
  })
  .finally(mongodb.closeClient)
