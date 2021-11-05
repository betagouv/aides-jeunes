const fs = require("fs")

const migrations = fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return file.match(/^toV\d+\.js$/)
  })
  .map(function (migrationFile) {
    return require("./" + migrationFile)
  })

migrations.sort(function (a, b) {
  return a.version - b.version
})

module.exports = {
  list: migrations,
  apply: function (situation) {
    migrations.forEach(function (migration) {
      if (situation.version < migration.version) {
        situation.version = migration.version
        situation = migration.function(situation)
      }
    })
    return situation
  },
}
