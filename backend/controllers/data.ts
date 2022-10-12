import data from "../../data/all"

export function benefits(req, res) {
  res.send(data.all)
}

const institutionList = Object.values(data.institutionsMap)

export function institutions(req, res) {
  res.send(institutionList)
}

export default { benefits, institutions }
