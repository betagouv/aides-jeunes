var subject = require("../../../../backend/lib/openfisca/mapping/individu/pastResourcesProxy")
var expect = require("expect")

describe("openfisca past resource proxy", function () {
  var date = new Date("2019-02-14")

  describe("proxyWithCurrentResources", function () {
    describe("situation with 12 month rolling data", function () {
      var individu = {
        salaire_net: {
          "2019-01": 12000,
        },
      }

      beforeEach(function () {
        subject.proxyWithCurrentResources(individu, date)
      })

      it("populates current fiscal year", function () {
        expect(individu.salaire_net["2017-01"]).toEqual(1000)
      })

      it("populates the previous fiscal year", function () {
        expect(individu.salaire_net["2016-01"]).toEqual(1000)
      })
    })

    describe("situation with fiscal data", function () {
      var individu = {
        salaire_imposable: {
          2017: 12120,
        },
        frais_reels: {
          2017: 24240,
        },
      }

      beforeEach(function () {
        subject.extendFiscalDataBackward(individu, date)
      })

      it("populates previous fiscal year", function () {
        expect(individu.salaire_imposable["2016-01"]).toEqual(1010)
        expect(individu.frais_reels["2016"]).toEqual(24240)
      })
    })
  })
})
