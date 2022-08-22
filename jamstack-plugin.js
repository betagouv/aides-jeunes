import fs from "fs"
import path from "path"
import yaml from "js-yaml"

import toSource from "tosource"
import { makeLegalIdentifier } from "@rollup/pluginutils"

function read(sourcePath) {
  return {
    source: fs.readFileSync(sourcePath),
    sourcePath,
  }
}

const load = yaml.load

function populate(collection, rootFolder) {
  let items = []

  if (!collection.folder) {
    if (this && this.emitWarning) {
      this.emitWarning(
        `Loader can only process collection with a folder (collection: ${collection.name})`
      )
    }
  } else if (collection.extension !== "yml") {
    if (this && this.emitWarning) {
      this.emitWarning(
        `Loader can only process yml files (provided extension: ${collection.extension})`
      )
    }
  } else {
    const cPath = path.join(rootFolder ? rootFolder : ".", collection.folder)
    if (this && this.addContextDependency) {
      this.addContextDependency(cPath)
    }

    const context = this

    try {
      items = fs
        .readdirSync(cPath)
        .filter((itemFile) =>
          [".yml", ".yaml"].includes(path.extname(itemFile).toLowerCase())
        )
        .map((itemFile) => {
          const slug = path.basename(itemFile, `.${collection.extension}`)
          const itemPath = path.join(cPath, itemFile)

          if (context && context.addDependency) {
            context.addDependency(itemPath)
          }

          return {
            slug,
            ...yaml.load(fs.readFileSync(itemPath)),
          }
        })
    } catch (e) {
      if (e.code !== "ENOENT") {
        throw e
      }
    }
  }

  return {
    ...collection,
    items: items,
  }
}

function build(config, sourcePath) {
  if (!config.collections) {
    throw `Missing collections at ${sourcePath}. Content ${JSON.stringify(
      config,
      null,
      1
    )}`
  }

  const rootPath = path.join(
    path.dirname(sourcePath),
    config.root ? config.root : "."
  )

  const pop = populate.bind(this)
  config.collections = config.collections.reduce((accum, collection) => {
    accum[collection.name] = pop(collection, rootPath)

    return accum
  }, {})

  return config
}

function get(configPath) {
  const config = read(configPath)
  return build(load(config.source), config.sourcePath)
}

export default function JamstackPlugin() {
  return {
    name: "jamstack",
    resolveId(source) {
      if (source.startsWith("jamstack")) {
        return { id: source + "?jamstack" }
      }

      return null
    },
    load(id) {
      if (!id.match(/[\?&]jamstack$/)) {
        return null
      }

      const fullPath = path.join(__dirname, id.slice(0, -" jamstack".length))
      const data = get(fullPath)
      const keys = Object.keys(data).filter(
        (key) => key === makeLegalIdentifier(key)
      )
      const code = `var data = ${toSource(data)};\n\n`
      const exports = ["export default data;"]
        .concat(keys.map((key) => `export var ${key} = data.${key};`))
        .join("\n")

      const source = code + exports
      return source
    },
  }
}
