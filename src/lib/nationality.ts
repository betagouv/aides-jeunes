import { EeeCountryCode } from "./enums/nationality.js"

let ZONE_LABEL = {
  fr: "française",
  ue: "UE",
  autre: "hors UE",
}

function getNationalityFromCountryCode(countryCode) {
  switch (countryCode) {
    case EeeCountryCode.DE:
      return "Européenne"
    case EeeCountryCode.FR:
      return "Française"
    case "AF":
      return "Non européenne"
  }
}

function getZone(countryCode) {
  if (!countryCode) {
    return ""
  }
  countryCode = countryCode.toUpperCase()

  if (countryCode === EeeCountryCode.FR) {
    return "fr"
  }
  if (EeeCountryCode.hasOwnProperty(countryCode) || countryCode === "CH") {
    return "ue"
  }
  if (countryCode === "AF") {
    return "autre"
  }

  return ""
}

const Nationality = {
  getLabel: function (nationality) {
    return ZONE_LABEL[getZone(nationality)]
  },
  getNationalityFromCountryCode: getNationalityFromCountryCode,
  getZone: getZone,
  getCountryCodeByNationality: function (nationality) {
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
