const fs = require("fs")
const path = require("path")

const files = []

function getFiles(dir) {
  const currentFiles = fs.readdirSync(dir)
  currentFiles.forEach((filename) => {
    if (
      ["dist", "node_modules"].includes(filename) ||
      filename.startsWith(".")
    ) {
      return
    }
    const absolute = path.join(dir, filename)
    if (fs.lstatSync(absolute).isDirectory()) {
      return getFiles(absolute)
    } else {
      const splitFilename = filename.split(".")
      const nameWithoutExtension = splitFilename
        .slice(0, splitFilename.length - 1)
        .join("")
      const extension = splitFilename[splitFilename.length - 1]

      return files.push({ filename: nameWithoutExtension, absolute, extension })
    }
  })
}
getFiles(process.env.NODE_PATH)

const result = files.filter((file) => {
  return ["js", "vue"].includes(file.extension)
})
let count = 0

result.forEach((file) => {
  if (!file.filename.match(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)) {
    count += 1
    console.log(`'${file.absolute}' ne respecte pas la norme.`)
  }
})
console.log(`Total: ${count}/${result.length} fichiers à renommer.`)
