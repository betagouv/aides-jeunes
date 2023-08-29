import fs from "fs"
import path from "path"
import dayjs from "dayjs"
import MongoDB from "../backend/lib/stats/mongodb.js"
import communes from "@etalab/decoupage-administratif/data/communes.json" assert { type: "json" }

const __dirname = new URL(".", import.meta.url).pathname
const depcoms100k = communes
  .filter((city) => city.population >= 100000)
  .map((city) => city.code)
const rangeSelector = {
  $match: {
    createdAt: { $lt: dayjs().startOf("month").toDate() },
  },
}

const simulationPerMonthPerActivity = [
  rangeSelector,
  {
    $project: {
      activite: {
        $arrayElemAt: [
          {
            $filter: {
              input: "$answers.all",
              cond: { $eq: ["$$this.fieldName", "activite"] },
            },
          },
          0,
        ],
      },
      date: "$dateDeValeur",
    },
  },
  {
    $group: {
      _id: {
        month: {
          $dateToString: {
            format: "%Y-%m",
            date: "$date",
          },
        },
        activite: { $ifNull: ["$activite.value", "#N/A"] },
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { "_id.month": 1, "_id.activite": 1 } },
]

const simulationPerMonthPerAge = [
  rangeSelector,
  {
    $project: {
      age: {
        $arrayElemAt: [
          {
            $filter: {
              input: "$answers.all",
              cond: { $eq: ["$$this.fieldName", "age"] },
            },
          },
          0,
        ],
      },
      date: "$dateDeValeur",
    },
  },
  {
    $group: {
      _id: {
        month: {
          $dateToString: {
            format: "%Y-%m",
            date: "$date",
          },
        },
        age: "$age.value",
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { "_id.month": 1, "_id.age": 1 } },
]

const simulationPerMonthPerDepcom = [
  rangeSelector,
  {
    $project: {
      depcom: {
        $arrayElemAt: [
          {
            $filter: {
              input: "$answers.all",
              cond: { $eq: ["$$this.fieldName", "depcom"] },
            },
          },
          0,
        ],
      },
      date: "$dateDeValeur",
    },
  },
  {
    $group: {
      _id: {
        month: {
          $dateToString: {
            format: "%Y-%m",
            date: "$date",
          },
        },
        depcom100kp: {
          $cond: [
            { $in: ["$depcom.value.depcom", depcoms100k] },
            "$depcom.value.depcom",
            "lt_100k",
          ],
        },
        departement: { $ifNull: ["$depcom.value._departement", "#N/A"] },
        region: { $ifNull: ["$depcom.value._region", "#N/A"] },
      },
      count: { $sum: 1 },
    },
  },
  {
    $sort: {
      "_id.month": 1,
      "_id.depcom100kp": 1,
      "_id.departement": 1,
      "_id.region": 1,
    },
  },
]

const statsParameters = [
  {
    headers: ["month", "activite", "count"],
    filename: "monthly_activite.csv",
    aggregate: simulationPerMonthPerActivity,
  },
  {
    headers: ["month", "age", "count"],
    filename: "monthly_age.csv",
    aggregate: simulationPerMonthPerAge,
  },
  {
    headers: ["month", "depcom100kp", "departement", "region", "count"],
    filename: "monthly_geo.csv",
    aggregate: simulationPerMonthPerDepcom,
  },
]

async function getSimulationStats(db, aggregate) {
  return await db.collection("simulations").aggregate(aggregate)
}

async function generateMongoStats() {
  try {
    const separator = ","
    const documentFolder = path.join(__dirname, "../dist/documents/")
    fs.mkdirSync(documentFolder, { recursive: true })
    const db = await MongoDB.connect()

    for (const statParameters of statsParameters) {
      const filepath = path.join(documentFolder, statParameters.filename)
      const aggregateCursor = await getSimulationStats(
        db,
        statParameters.aggregate
      )
      const fileStream = fs.createWriteStream(filepath)
      fileStream.write(`${statParameters.headers.join(separator)}\n`)

      for await (const document of aggregateCursor) {
        const line = statParameters.headers.map(
          (key) => document[key] || document._id[key] || ""
        )
        fileStream.write(`${line.join(separator)}\n`)
      }
      fileStream.end()
      console.log(`Generated statistics file: ${statParameters.filename}`)
    }
    MongoDB.closeClient()
  } catch (error) {
    console.error(`An error occured: ${error}`)
  }
}
await generateMongoStats()
