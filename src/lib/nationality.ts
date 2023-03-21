import { EeeCountryCode } from "./enums/nationality.js"

const ZONE_LABEL = {
  fr: "française",
  ue: "UE",
  autre: "hors UE",
}

function getNationalityFromCountryCode(countryCode: string) {
  switch (countryCode) {
    case EeeCountryCode.DE:
      return "Européenne"
    case EeeCountryCode.FR:
      return "Française"
    case "AF":
      return "Non européenne"
  }
}

function getZone(countryCode: string): string {
  if (!countryCode) {
    return ""
  }
  countryCode = countryCode.toUpperCase()

  if (countryCode === EeeCountryCode.FR) {
    return "fr"
  }
  if (
    Object.prototype.hasOwnProperty.call(EeeCountryCode, countryCode) ||
    countryCode === "CH"
  ) {
    return "ue"
  }
  if (countryCode === "AF") {
    return "autre"
  }

  return ""
}

const Nationality = {
  getLabel: function (nationality: string): string {
    return ZONE_LABEL[getZone(nationality)]
  },
  getNationalityFromCountryCode: getNationalityFromCountryCode,
  getZone: getZone,
  getCountryCodeByNationality: function (nationality: string): string {
    switch (nationality) {
      case "ue":
        return "DE"
      case "autre":
        return "AF"
    }

    return "FR"
  },
}

export default Nationality
