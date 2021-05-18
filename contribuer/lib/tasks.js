function importTask(slug) {
  return {
    ...require(`../content/tasks/${slug}.md`),
    slug,
  }
}

module.exports = [
  importTask("utiliser"),
  importTask("partager"),
  importTask("ajouter-une-institution"),
  importTask("ajouter-une-aide"),
  importTask("cibler-associations"),
  importTask("cibler-elus"),
]
