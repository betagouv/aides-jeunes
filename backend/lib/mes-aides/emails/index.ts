import fs from "fs"
import Mjml from "mjml"
import path from "path"

export function toBase64(file: string) {
  return fs.readFileSync(file, "base64")
}

export const imageRoot = path.join(path.dirname(""), "../../../../public/img/")

export const defaultAttachments = [
  // {
  //     ContentType: 'image/svg+xml',
  //     Filename: 'logo.svg',
  //     ContentID: "logo",
  //     Base64Content: toBase64(path.join(exports.imageRoot, '../../src/assets/images/logo1j1s-france-relance.svg'))
  // }, {
  //     ContentType: 'image/png',
  //     Filename: 'marianne.png',
  //     ContentID: "marianne",
  //     Base64Content: toBase64(path.join(exports.imageRoot, 'marianne.png'))
  // }
]

export function mjml(template) {
  return Mjml(template, {
    fonts: {},
  })
}
