import core from "@actions/core"
import github from "@actions/github"

async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      issueNumber: Number(core.getInput("issue number")),
      comment: core.getInput("comment"),
    }

    const repository = process.env.GITHUB_REPOSITORY
    const [owner, repo] = repository.split("/")

    const octokit = github.getOctokit(inputs.token)

    core.info("Editing the issue")
    await octokit.rest.issues.update({
      owner: owner,
      repo: repo,
      issue_number: inputs.issueNumber,
      state: "open",
      body: inputs.comment.replace(/<br \/>/g, `\n`),
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
