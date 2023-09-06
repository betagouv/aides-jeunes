import {
  EuropeanCountryCode,
  NonEuropeanCountryCode,
  ZoneCode,
} from "./enums/nationality.js"

const ZONE_LABEL = {
  [ZoneCode.FR]: "française",
  [ZoneCode.UE]: "UE",
  [ZoneCode.Other]: "hors UE",
}

function getNationalityFromCountryCode(countryCode: string) {
  switch (countryCode) {
    case EuropeanCountryCode.DE:
      return "Européenne"
    case EuropeanCountryCode.FR:
      return "Française"
    case NonEuropeanCountryCode.AF:
      return "Non européenne"
  }
}

function getZone(countryCode: string): string {
  if (!countryCode) {
    return ZoneCode.Empty
  }
  countryCode = countryCode.toUpperCase()

  if (countryCode === EuropeanCountryCode.FR) {
    return ZoneCode.FR
  }
  if (
    countryCode in EuropeanCountryCode ||
    countryCode === NonEuropeanCountryCode.CH
  ) {
    return ZoneCode.UE
  }
  if (countryCode === NonEuropeanCountryCode.AF) {
    return ZoneCode.Other
  }

  return ZoneCode.Empty
}

const Nationality = {
  getLabel: function (nationality: string): string {
    return ZONE_LABEL[getZone(nationality)]
  },
  getNationalityFromCountryCode: getNationalityFromCountryCode,
  getZone: getZone,
  getCountryCodeByNationality: function (nationality: string): string {
    switch (nationality) {
      case ZoneCode.UE:
        return EuropeanCountryCode.DE
      case ZoneCode.Other:
        return NonEuropeanCountryCode.AF
    }

    return EuropeanCountryCode.FR
  },
}

export default Nationality
