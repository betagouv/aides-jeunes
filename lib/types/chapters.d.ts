import { ChapterState } from "@lib/enums/chapter"

export interface chapterLayout {
  label: string
  name: string
  state?: ChapterState
  root?: string
}
