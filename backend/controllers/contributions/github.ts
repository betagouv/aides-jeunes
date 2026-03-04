import axios, { AxiosInstance } from "axios"
import type { Response } from "express"

const owner = process.env.GITHUB_OWNER
const repositoryName = process.env.GITHUB_REPOSITORY

function withTimestamp(branchName: string) {
  return `${branchName}-${Date.now()}`
}

export function ensureGithubToken(res: Response): boolean {
  if (!process.env.GITHUB_TOKEN) {
    res.status(500).json({ message: "GITHUB_TOKEN manquant côté serveur" })
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
  const refResp = await githubApi.get(
    `/repos/${owner}/${repositoryName}/git/ref/heads/main`,
  )
  return refResp.data.object.sha
}

export async function createBranch(
  githubApi: AxiosInstance,
  branchName: string,
  baseSha: string,
): Promise<string> {
  try {
    await githubApi.post(`/repos/${owner}/${repositoryName}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    })
    return branchName
  } catch (error: any) {
    if (error?.response?.status === 422) {
      const fallbackBranch = withTimestamp(branchName)
      await githubApi.post(`/repos/${owner}/${repositoryName}/git/refs`, {
        ref: `refs/heads/${fallbackBranch}`,
        sha: baseSha,
      })
      return fallbackBranch
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
  const contentB64 = Buffer.from(content, "utf8").toString("base64")
  await githubApi.put(
    `/repos/${owner}/${repositoryName}/contents/${encodeURIComponent(filePath)}`,
    {
      message: commitMessage,
      content: contentB64,
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
    `/repos/${owner}/${repositoryName}/contents/${encodeURIComponent(filePath)}`,
    {
      message: commitMessage,
      content: base64Content,
      branch: branchName,
    },
  )
}

export async function createPullRequest(
  githubApi: AxiosInstance,
  title: string,
  branchName: string,
  body: string,
): Promise<string> {
  const prResp = await githubApi.post(
    `/repos/${owner}/${repositoryName}/pulls`,
    {
      title,
      head: branchName,
      base: "main",
      body,
      maintainer_can_modify: true,
    },
  )
  return prResp.data.html_url
}

export async function checkInstitutionExists(
  institutionSlug: string,
  githubApi: AxiosInstance,
): Promise<boolean> {
  const institutionPath = `data/institutions/${institutionSlug}.yml`
  try {
    await githubApi.get(
      `/repos/${owner}/${repositoryName}/contents/${encodeURIComponent(institutionPath)}?ref=main`,
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
