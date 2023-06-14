export interface EmailLayout {
  from?: string
  to: string
  subject: string
  text: string
  html: string
  headers?: {
    "x-tm-tags": string
  }
}
