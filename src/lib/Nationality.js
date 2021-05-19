let ZONE_LABEL = {
  fr: "française",
  ue: "UE",
  autre: "hors UE",
}

let EEE_COUNTRY_CODES = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LU",
  "LV",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
  "UK",
]

function getNationalityFromCountryCode(countryCode) {
  switch (countryCode) {
    case "DE":
      return "Européenne"
    case "FR":
      return "Français"
    case "AF":
      return "Non européenne"
  }
}

function getZone(countryCode) {
  if (!countryCode) {
    return ""
  }
  countryCode = countryCode.toUpperCase()

  if (countryCode === "FR") {
    return "fr"
  }
  if (EEE_COUNTRY_CODES.includes(countryCode) || countryCode === "CH") {
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
