const fs = require("fs")
const path = require("path")
const kebabCase = require("lodash/kebabCase")

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
      return files.push({ absolute, filename })
    }
  })
}
getFiles(__dirname)

const result = files.filter((file) => {
  const splitFilename = file.filename.split(".")
  const extension = splitFilename[splitFilename.length - 1]
  return ["js", "vue"].includes(extension)
})

result.forEach((file) => {
  if (file.filename !== kebabCase(file.filename)) {
    console.log(`'${file.absolute}' ne respecte pas la norme.`)
  }
})
console.log(`Total: ${result.length} fichiers`)
