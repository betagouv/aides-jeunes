import fs from "fs"
import Mjml from "mjml"
import path from "path"

export function toBase64(file: string) {
  return fs.readFileSync(file, "base64")
}

export const imageRoot = path.join(__dirname, "../../../../public/img/")

export function mjml(template) {
  return Mjml(template, {
    fonts: {},
  })
}
