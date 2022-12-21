import fs from "fs"

const migrationFilesByModelName = getMigrationsFiles()

function getMigrationsFileNamesByModelName(modelName) {
  return fs.readdirSync(`${__dirname}/${modelName}`).filter(function (file) {
    return file.match(/^to-v\d+\.js|ts$/)
  })
}

function getMigrationsFiles() {
  const migrationFiles = {}
  for (const folderName of fs.readdirSync(__dirname)) {
    if (fs.statSync(`${__dirname}/${folderName}`).isDirectory()) {
      migrationFiles[folderName] = {}
      for (const migrationFileName of getMigrationsFileNamesByModelName(
        folderName
      )) {
        migrationFiles[folderName][migrationFileName] =
          require(`${__dirname}/${folderName}/${migrationFileName}`).default
      }
    }
  }
  return migrationFiles
}

function getSortedMigrations(modelName) {
  return Object.values(migrationFilesByModelName[modelName]).sort(function (
    a: any,
    b: any
  ) {
    return a.version - b.version
  })
}

function getLatestVersion(migrations) {
  return migrations[migrations.length - 1].version
}

export function getLatestVersionByModelName(modelName) {
  const migrations = getSortedMigrations(modelName)
  return getLatestVersion(migrations)
}

export function apply(model) {
  const folderName = `${model.constructor.modelName.toLowerCase()}s`
  const migrations = getSortedMigrations(folderName)

  migrations.forEach(function (migration: any) {
    if (model.version === undefined || model.version < migration.version) {
      model = migration.apply(model)
      model.version = migration.version
    }
  })
  return model
}
