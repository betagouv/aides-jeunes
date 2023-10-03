import { ChapterState, ChapterName } from "@lib/enums/chapter"

export interface Chapter {
  label: string
  name: ChapterName
  state?: ChapterState
  root?: string
}
