import { additionalProps } from "@root/backend/lib/openfisca/mapping/individu"
import expect from "expect"

const situation = {
  demandeur: { _bourseCriteresSociauxCommuneDomicileFamilial: "38185" },
  menage: { depcom: "33090" },
}

describe("distance computation", function () {
  const result =
    additionalProps.bourse_criteres_sociaux_distance_domicile_familial.fn(
      situation.demandeur,
      situation
    )

  it("should return a kilometer value", function () {
    expect(result).toBeCloseTo(510, -1.5) // -1.5 is in digits after the valid interval as a 10^1,5=30km size
  })
})

const situationWithoutParents = {
  demandeur: { _bourseCriteresSociauxCommuneDomicileFamilial: "38185" },
  menage: { depcom: "33090" },
  parents: {
    _situation: "decedes",
  },
}

describe("distance computation without parents", function () {
  const result =
    additionalProps.bourse_criteres_sociaux_distance_domicile_familial.fn(
      situationWithoutParents.demandeur,
      situationWithoutParents
    )

  it("should return a value equal to 0", function () {
    expect(result).toEqual(0)
  })
})

const situationDivorcedParents = {
  demandeur: { _bourseCriteresSociauxCommuneDomicileFamilial: "38185" },
  menage: { depcom: "33090" },
  parents: {
    _situation: "separes",
  },
}

describe("distance computation without parents", function () {
  const result =
    additionalProps.bourse_criteres_sociaux_distance_domicile_familial.fn(
      situationDivorcedParents.demandeur,
      situationDivorcedParents
    )

  it("should return a kilometer value", function () {
    expect(result).toBeCloseTo(255, -1.5) // -1.5 is in digits after the valid interval as a 10^1,5=30km size
  })
})
