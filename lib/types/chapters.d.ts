import { ChapterState } from "@lib/enums/chapter"

export interface Chapter {
  label: string
  name: string
  state?: ChapterState
  root?: string
}
