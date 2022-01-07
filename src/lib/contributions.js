import { load } from "js-yaml"
const axios = require("axios")

const MES_AIDES_PR_GITHUB =
  "https://api.github.com/repos/betagouv/aides-jeunes/pulls"
const CONTRIBUTION_TAG = "netlify-cms"

export function reduceContributions(acc, contribution, type) {
  const splitLabel = contribution.head.label.split("/")
  if (splitLabel[1] === type) {
    acc.push({
      sha: contribution.head.sha,
      filename: splitLabel[2] + ".yml",
      folder: type,
    })
  }
  return acc
}

export async function getGithubPRFiles({ sha, folder, filename }) {
  const response = await fetch(
    `https://raw.githubusercontent.com/betagouv/aides-jeunes/${sha}/data/${folder}/${filename}`
  )
  const blob = await response.blob()
  const text = await blob.text()
  const data = load(text, { encoding: "utf-8" })
  return data
}

export function fetchContributions() {
  return axios.get(MES_AIDES_PR_GITHUB).then((res) => {
    let contributions = []
    if (res.data) {
      contributions = res.data.filter((k) =>
        k.labels.some((e) => e.name.startsWith(CONTRIBUTION_TAG))
      )
    }
    return contributions
  })
}
