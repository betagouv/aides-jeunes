import { omit } from "lodash-es"
import fs from "fs/promises"
import mongodb from "./mongodb.js"

mongodb
  .connect()
  .then((db) => {
    const p: Promise<any[]> = new Promise((resolve, reject) => {
      db.collection("followups")
        .find({ "surveys.repliedAt": { $exists: true } })
        .toArray((err, items) => {
          if (err) {
            return reject(err)
          }
          const rows: any[] = []
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
    })
    return p
  })
  .then((r) => {
    const csv = r.map((i) =>
      Object.values(i)
        .map((s) => `"${s}"`)
        .join(";")
    )
    csv.unshift("benefit;result;comment;id;date")
    return fs.writeFile("data.csv", csv.join("\n"), "utf-8")
  })
  .then((r) => {
    console.log(r)
  })
  .finally(mongodb.closeClient)
