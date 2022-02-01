const fs = require("fs")

const migrations = fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return file.match(/^to-v\d+\.js$/)
  })
  .map(function (migrationFile) {
    return require("./" + migrationFile)
  })

migrations.sort(function (a, b) {
  return a.version - b.version
})

const latestVersion = Math.max(migrations.map((migration) => migration.version))

const isLatestVersion = (simulation) => {
  return simulation.version >= latestVersion
}

module.exports = {
  list: migrations,
  apply: function (simulation) {
    if (!isLatestVersion(simulation.version)) {
      migrations.forEach(function (migration) {
        if (simulation.version < migration.version) {
          simulation.version = migration.version
          simulation = migration.function(simulation)
        }
      })
    }
    return simulation
  },
}
