import axios, { AxiosInstance } from "axios"
import type { Response } from "express"

const repositoryName = process.env.GITHUB_REPOSITORY || ""
const upstreamOwner = process.env.GITHUB_OWNER || ""
const forkOwner = process.env.GITHUB_FORK_OWNER || upstreamOwner
const baseBranch = process.env.GITHUB_BASE_BRANCH || "main"

export function ensureGithubToken(res: Response): boolean {
  const missing = ["GITHUB_OWNER", "GITHUB_REPOSITORY", "GITHUB_TOKEN"].filter(
    (key) => !process.env[key],
  )
  if (missing.length > 0) {
    res.status(500).json({
      message: `Variables d'environnement manquantes: ${missing.join(", ")}`,
    })
    return false
  }
  return true
}

export function createGithubApi(): AxiosInstance {
  return axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "aides-jeunes-contribution-service",
    },
  })
}

export async function getMainBranchSha(
  githubApi: AxiosInstance,
): Promise<string> {
  const resp = await githubApi.get(
    `/repos/${forkOwner}/${repositoryName}/git/ref/heads/${baseBranch}`,
  )
  return resp.data.object.sha
}

export async function createBranch(
  githubApi: AxiosInstance,
  branchName: string,
  baseSha: string,
): Promise<string> {
  const post = (name: string) =>
    githubApi.post(`/repos/${forkOwner}/${repositoryName}/git/refs`, {
      ref: `refs/heads/${name}`,
      sha: baseSha,
    })
  try {
    await post(branchName)
    return branchName
  } catch (error: any) {
    if (error?.response?.status === 422) {
      const fallback = `${branchName}-${Date.now()}`
      await post(fallback)
      return fallback
    }
    throw error
  }
}

export async function commitFile(
  githubApi: AxiosInstance,
  filePath: string,
  content: string,
  branchName: string,
  commitMessage: string,
): Promise<void> {
  await githubApi.put(
    `/repos/${forkOwner}/${repositoryName}/contents/${encodeURIComponent(filePath)}`,
    {
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      branch: branchName,
    },
  )
}

export async function commitBinaryFile(
  githubApi: AxiosInstance,
  filePath: string,
  base64Content: string,
  branchName: string,
  commitMessage: string,
): Promise<void> {
  await githubApi.put(
    `/repos/${forkOwner}/${repositoryName}/contents/${encodeURIComponent(filePath)}`,
    { message: commitMessage, content: base64Content, branch: branchName },
  )
}

export async function createPullRequest(
  githubApi: AxiosInstance,
  title: string,
  branchName: string,
  body: string,
): Promise<string> {
  const head =
    forkOwner === upstreamOwner ? branchName : `${forkOwner}:${branchName}`
  const resp = await githubApi.post(
    `/repos/${upstreamOwner}/${repositoryName}/pulls`,
    { title, head, base: baseBranch, body, maintainer_can_modify: true },
  )
  return resp.data.html_url
}

export async function checkInstitutionExists(
  institutionSlug: string,
  githubApi: AxiosInstance,
): Promise<boolean> {
  try {
    await githubApi.get(
      `/repos/${upstreamOwner}/${repositoryName}/contents/${encodeURIComponent(`data/institutions/${institutionSlug}.yml`)}?ref=${baseBranch}`,
    )
    return true
  } catch (error: any) {
    if (error.response?.status === 404) return false
    throw error
  }
}

export async function initContributionBranch(branchBase: string): Promise<{
  githubApi: AxiosInstance
  newBranch: string
}> {
  const githubApi = createGithubApi()
  const baseSha = await getMainBranchSha(githubApi)
  const newBranch = await createBranch(githubApi, branchBase, baseSha)
  return { githubApi, newBranch }
}
