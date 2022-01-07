const fs = require("fs")
const path = require("path")
const expect = require("expect")

describe("Test filenames rules", function () {
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

        return files.push({
          filename: nameWithoutExtension,
          absolute,
          extension,
        })
      }
    })
  }

  getFiles(process.env.NODE_PATH)

  const result = files.filter((file) => {
    return ["js", "vue"].includes(file.extension)
  })

  result.forEach((file) => {
    describe(file.filename, function () {
      it("should respect kebab-case rule", function () {
        expect(
          file.filename.match(/^(_?)([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)
        ).toBeTruthy()
      })
    })
  })
})
