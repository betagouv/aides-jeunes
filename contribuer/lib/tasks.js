
function importTask(slug) {
  return {
    ...require(`../content/tasks/${slug}.md`),
    slug
  }
}

module.exports = [
  importTask('ajouter-une-aide'),
  importTask('cibler-associations'),
  importTask('cibler-elus'),
  importTask('partager'),
  importTask('utiliser')
]
