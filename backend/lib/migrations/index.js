const fs = require("fs")

function getMigrations(folderName) {
  const folderPath = `${__dirname}/${folderName}`
  const migrations = fs
    .readdirSync(folderPath)
    .filter(function (file) {
      return file.match(/^to-v\d+\.js$/)
    })
    .map(function (migrationFile) {
      return require(`${folderPath}/${migrationFile}`)
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

module.exports = {
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
