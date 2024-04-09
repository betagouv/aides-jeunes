import axios from "axios"

let data = null

async function getArtifactMetadata() {
  const artifactListResponse = await axios.get(
    "https://api.github.com/repos/betagouv/aides-jeunes/actions/artifacts"
  )
  const artifactListPayload = artifactListResponse.data
  const releventArtifacts = artifactListPayload.artifacts.filter((artifact) => {
    return (
      artifact.name === "cypress-json-base" &&
      artifact.workflow_run.head_branch === "main"
    )
  })
  return releventArtifacts.length ? releventArtifacts[0] : null
}

async function fetchArtifactZip() {
  if (data) {
    return data
  }
  const metadata = await getArtifactMetadata()
  if (!metadata) {
    return
  }

  const url = `https://nightly.link/betagouv/aides-jeunes/actions/runs/${metadata.workflow_run.id}/${metadata.name}.zip`
  const artifact = await axios.get(url, {
    responseType: "arraybuffer",
  })

  data = artifact.data
  return data
}

async function get(req, res) {
  const zipBlob = await fetchArtifactZip()
  res.attachment("payload.zip")
  res.send(zipBlob)
}

export default {
  get,
}
