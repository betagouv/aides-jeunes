import fs from "fs"
import { URL } from "url"
const __dirname = new URL(".", import.meta.url).pathname

function getMigrations(folderName) {
  const folderPath = `${__dirname}/${folderName}`
  const migrations = fs
    .readdirSync(folderPath)
    .filter(function (file) {
      return file.match(/^to-v\d+\.js$/)
    })
    .map(async function (migrationFile) {
      return await import(`${folderPath}/${migrationFile}`)
    })

  migrations.sort(function (a, b) {
    return a.version - b.version
  })
  return migrations
}

function getLatestVersion(migrations) {
  return migrations[migrations.length - 1].version
}

function getLatestVersionByFolderName(folderName) {
  const migrations = getMigrations(folderName)
  return getLatestVersion(migrations)
}

export default {
  getLatestVersionByFolderName,
  apply: function (model) {
    const folderName = `${model.constructor.modelName.toLowerCase()}s`
    const migrations = getMigrations(folderName)

    migrations.forEach(function (migration) {
      if (model.version === undefined || model.version < migration.version) {
        model.version = migration.version
        model = migration.function(model)
      }
    })
    return model
  },
}
