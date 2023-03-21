import { load } from "js-yaml"
import axios from "axios"

const MES_AIDES_PR_GITHUB =
  "https://api.github.com/repos/betagouv/aides-jeunes/pulls"
const CONTRIBUTION_TAG = "netlify-cms"

export function reduceContribution<
  T extends { sha: string; filename: string; folder: string }
>(
  acc: T[],
  contribution: { head: { sha: string; label: string } },
  type: string
): T[] {
  const splitLabel: string[] = contribution.head.label.split("/")
  if (splitLabel[1] === type) {
    acc.push({
      sha: contribution.head.sha,
      filename: `${splitLabel[2]}.yml`,
      folder: type,
    } as T)
  }
  return acc
}

export async function getGithubPRFiles({
  sha,
  folder,
  filename,
}: {
  sha: string
  folder: string
  filename: string
}): Promise<string[]> {
  const response = await fetch(
    `https://raw.githubusercontent.com/betagouv/aides-jeunes/${sha}/data/${folder}/${filename}`
  )
  const blob = await response.blob()
  const text = await blob.text()
  const data: Promise<string[]> = load(text, { encoding: "utf-8" })
  return data
}

export function fetchContributions(): Promise<string[]> {
  return axios.get(MES_AIDES_PR_GITHUB).then((res) => {
    let contributions: string[] = []
    if (res.data) {
      contributions = res.data.filter((k) =>
        k.labels.some((e) => e.name.startsWith(CONTRIBUTION_TAG))
      )
    }
    return contributions
  })
}
