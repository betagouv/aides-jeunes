import fs from "fs"
import path from "path"
import dayjs from "dayjs"
import MongoDB from "../backend/lib/stats/mongodb.js"

const __dirname = new URL(".", import.meta.url).pathname
const depcoms100k = [
  "13001",
  "13055",
  "21231",
  "29019",
  "30189",
  "31555",
  "33063",
  "34172",
  "35238",
  "37261",
  "38185",
  "42218",
  "44109",
  "49007",
  "51454",
  "59350",
  "63113",
  "67482",
  "69123",
  "69266",
  "72181",
  "74010",
  "75056",
  "76351",
  "80021",
  "83137",
  "87085",
  "92012",
  "97411",
  "06088",
]
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
  { $sort: { "_id.month": 1 } },
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
  { $sort: { "_id.month": 1 } },
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
            "#N/A",
          ],
        },
        departement: { $ifNull: ["$depcom.value._departement", "#N/A"] },
        region: { $ifNull: ["$depcom.value._region", "#N/A"] },
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { "_id.month": 1 } },
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
    const db = await MongoDB.connect()
    const separator = ","
    const documentFolder = path.join(__dirname, "../dist/documents/")
    fs.mkdirSync(documentFolder, { recursive: true })

    for (const statParameters of statsParameters) {
      const filepath = path.join(documentFolder, statParameters.filename)
      const aggregateCursor = await getSimulationStats(
        db,
        statParameters.aggregate
      )
      const fileStream = fs.createWriteStream(filepath)
      fileStream.write(`${statParameters.headers.join(separator)}\n`)

      for await (const document of aggregateCursor) {
        const line: string[] = []
        for (const key of statParameters.headers) {
          line.push(document[key] || document._id[key] || "")
        }
        fileStream.write(`${line.join(separator)}\n`)
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`)
  } finally {
    MongoDB.closeClient()
  }
}
await generateMongoStats()
