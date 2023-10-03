import { Chapter } from "./types/chapters.js"
import { ChapterName, ChapterLabel } from "./enums/chapter.js"

const chapters: Chapter[] = [
  { label: ChapterLabel.MonProfil, name: ChapterName.Profil },
  { label: ChapterLabel.MonFoyer, name: ChapterName.Foyer },
  { label: ChapterLabel.MonLogement, name: ChapterName.Logement },
  { label: ChapterLabel.MesRevenus, name: ChapterName.Revenus },
  { label: ChapterLabel.MesProjets, name: ChapterName.Projets },
  { label: ChapterLabel.Recapitulatif, name: ChapterName.Recapitulatif },
  { label: ChapterLabel.Resultats, name: ChapterName.Resultats },
]

function getChapters() {
  return chapters
}

function getSommaireChapters() {
  return chapters.filter((c) => c.name !== ChapterName.Resultats)
}

function getLabel(name: string) {
  const chapter = chapters.find((c) => c.name === name)
  return chapter?.label || ChapterLabel.MonProfil
}

const Chapters = {
  getLabel,
  getChapters,
  getSommaireChapters,
}

export default Chapters
