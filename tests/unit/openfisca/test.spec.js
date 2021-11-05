const expect = require("expect")
const { values } = require("lodash")
const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const subject = require("../../../backend/lib/openfisca/test")
const resources = require("../../../lib/Resources")
const tmp = require("tmp")

const details = {
  name: "Ideal name",
  description: "Thorough description",
  output: {
    rsa: 545.48,
  },
  absolute_error_margin: 0.1,
}

const currentPeriod = "2018-01"
const situation = {
  dateDeValeur: new Date(currentPeriod),
  famille: {},
  demandeur: {
    id: "id",
    date_naissance: new Date("1989-01-01"),
    _role: "demandeur",
  },
  menage: {
    personne_de_reference: ["id"],
    statut_occupation_logement: "sans_domicile",
  },
}

describe("openfisca generateTest", function () {
  const result = subject.generateTest(details, situation)

  it("does not add rsa_non_calculable", function () {
    expect(
      typeof result.input.familles._.rsa_non_calculable[currentPeriod]
    ).toBe("undefined")
  })
})

function run_cmd(cmd, args) {
  return new Promise(function (resolve, reject) {
    const spawn = require("child_process").spawn
    const child = spawn(cmd, args)
    let respErr = ""
    let respOut = ""

    child.stdout.on("data", function (buffer) {
      respOut += buffer.toString()
    })
    child.stderr.on("data", function (buffer) {
      respErr += buffer.toString()
    })
    child.on("exit", function (code) {
      const result = {
        stdout: respOut,
        stderr: respErr,
      }
      if (code) {
        result.error = "Exit code was " + code
        reject(result)
      } else {
        resolve(result)
      }
    })
    child.on("error", function (err) {
      reject({ error: err })
    })
  })
}

function runOpenFiscaTest(yaml, extension) {
  const tmpobj = tmp.fileSync({ postfix: ".yaml" })
  return fs.writeFileAsync(tmpobj.fd, yaml, "utf8").then(function () {
    const args = extension
      ? ["test", tmpobj.name, "--extensions", extension]
      : ["test", tmpobj.name]

    return run_cmd("openfisca", args)
  })
}

describe("openfisca generateYAMLTest", function () {
  const result = subject.generateYAMLTest(details, situation)

  it("generates a non empty string", function () {
    expect(result).toBeTruthy()
  })

  it("contains provided output", function () {
    expect(result).toContain("rsa: 545.48")
  })

  function validateYAMLRun(payload, extension) {
    return runOpenFiscaTest(payload, extension)
      .catch(function (failure) {
        expect(failure).toBeFalsy()

        return failure
      })
      .then(function (result) {
        expect(result.stdout).toMatch(/ passed/)

        expect(result.stdout).not.toMatch(/ failed /)
        expect(result.stdout).not.toMatch(/= ERRORS =/)
        expect(result.stdout).not.toMatch(/= FAILURES =/)
      })
  }

  if (process.env.VIRTUAL_ENV) {
    describe("generates processable YAML files", function () {
      it("passes OpenFisca test without extension", function () {
        const info = Object.assign({}, details)
        const yamlContent = subject.generateYAMLTest(info, situation)

        return validateYAMLRun(yamlContent)
      })

      describe("with all possible resources", function () {
        it("passes OpenFisca test without extension", function () {
          const info = Object.assign({}, details, { output: { rsa: 0 } })
          const resourceSituation = Object.assign({}, situation, {
            demandeur: Object.assign({}, situation.demandeur),
          })
          resources.ressourceTypes.forEach((resource) => {
            const period = resource.isMontantAnnuel
              ? currentPeriod.slice(0, 4)
              : currentPeriod
            resourceSituation.demandeur[resource.id] = {
              [period]: 0,
            }
          })

          const yamlContent = subject.generateYAMLTest(info, resourceSituation)

          return validateYAMLRun(yamlContent)
        })
      })

      Object.keys(subject.EXTENSION_VARIABLES).forEach(function (
        extensionName
      ) {
        it(
          "passes OpenFisca test with " + extensionName + " extension",
          function () {
            const info = Object.assign({ extension: extensionName }, details)
            const yamlContent = subject.generateYAMLTest(info, situation)

            const variableListRegex = values(
              subject.EXTENSION_VARIABLES[extensionName]
            )
              .map(function (variableList) {
                return variableList.join("|")
              })
              .join("|")
            expect(yamlContent).toMatch(new RegExp(variableListRegex))

            return validateYAMLRun(
              yamlContent,
              extensionName.replace(/-/g, "_")
            )
          }
        )
      })
    })
  }
})
