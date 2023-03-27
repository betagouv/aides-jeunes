import { load } from "js-yaml"
import axios from "axios"

const MES_AIDES_PR_GITHUB =
  "https://api.github.com/repos/betagouv/aides-jeunes/pulls"
const CONTRIBUTION_TAG = "netlify-cms"

interface Contribution {
  head: {
    sha: string
    label: string
  }
}

export function reduceContribution<
  T extends { sha: string; filename: string; folder: string }
>(acc: T[], contribution: Contribution, type: string): T[] {
  const { sha, label } = contribution.head
  const [folder, filename] = label.split("/")
  if (folder === type) {
    acc.push({
      sha,
      filename: `${filename}.yml`,
      folder,
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
}): Promise<Contribution> {
  const response = await fetch(
    `https://raw.githubusercontent.com/betagouv/aides-jeunes/${sha}/data/${folder}/${filename}`
  )
  const blob = await response.blob()
  const text = await blob.text()
  const data: Promise<Contribution> = load(text, { encoding: "utf-8" })
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
