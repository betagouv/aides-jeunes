const chapters = [
  { label: "Mon profil", name: "profil" },
  { label: "Mon foyer", name: "foyer" },
  { label: "Mon logement", name: "logement" },
  { label: "Mes revenus", name: "revenus" },
  { label: "Mes projets", name: "projets" },
  { label: "Récapitulatif", name: "recapitulatif" },
  { label: "Mes résultats", name: "resultats" },
]

function getChapters() {
  return chapters
}

function getSommaireChapters() {
  return chapters.filter((c) => c.name !== "resultats")
}

function getLabel(name) {
  const chapter = chapters.find((c) => c.name === name)
  return (chapter && chapter.label) || "Ma simulation"
}

const Chapters = {
  getLabel,
  getChapters,
  getSommaireChapters,
}

export default Chapters
