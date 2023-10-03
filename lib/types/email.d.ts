export interface Email {
  from?: string
  to: string
  subject: string
  text: string
  html: string
  tags?: string[]
}
