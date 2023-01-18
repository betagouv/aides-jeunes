import fs from "fs"
import Mjml from "mjml"
import path from "path"
import config from "../../../config/index"

export function toBase64(file: string) {
  return fs.readFileSync(file, "base64")
}

export const imageRoot = path.join(__dirname, "../../../../public/img/")

export const followupLinksDataBuilder = (followup, links) => {
  const data = {}
  links.forEach((link) => {
    switch (link) {
      case "baseURL":
        data[link] = config.baseURL
        break
      case "ctaLink":
        data[link] = `${config.baseURL}${followup.surveyPath}`
        break
      case "returnURL":
        data[link] = `${config.baseURL}${followup.returnPath}`
        break
      case "wasUsefulLinkYes":
        data[link] = `${config.baseURL}${followup.wasUsefulPath}`
        break
      case "wasUsefulLinkNo":
        data[link] = `${config.baseURL}${followup.wasNotUsefulPath}`
        break
      default:
        break
    }
  })
  return data
}

export function mjml(template) {
  return Mjml(template, {
    fonts: {},
  })
}
