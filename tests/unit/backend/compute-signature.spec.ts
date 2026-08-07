import { expect, vi } from "vitest"

const { catalog, sources, getCountryPackageMetadata, captureException } =
  vi.hoisted(() => ({
    catalog: { value: { all: [{ id: "aide-a", montant: 100 }] } as any },
    sources: {
      requirements: "",
      packageJson: "",
      readError: undefined as Error | undefined,
    },
    getCountryPackageMetadata: vi.fn(),
    captureException: vi.fn(),
  }))

vi.mock("@root/data/all.js", () => ({
  get default() {
    return catalog.value
  },
}))

vi.mock("node:fs", async (importOriginal) => {
  const original = (await importOriginal()) as any
  const existsSync = (target: string) => String(target).endsWith("package.json")
  const readFileSync = (target: string) => {
    if (sources.readError) {
      throw sources.readError
    }

    return String(target).endsWith("requirements.txt")
      ? sources.requirements
      : sources.packageJson
  }

  return {
    ...original,
    default: { ...original.default, existsSync, readFileSync },
    existsSync,
    readFileSync,
  }
})

vi.mock("@backend/lib/openfisca/getter.js", () => ({
  default: { getCountryPackageMetadata },
}))

vi.mock("@sentry/node", () => ({ captureException }))

const A_REQUIREMENTS_FILE =
  "Openfisca-France==175.1.7\nOpenFisca-France-Local[excel-reader]==6.17.10\nOpenfisca-Paris==5.5.14\n"

function aPackageJson(overrides = {}) {
  return JSON.stringify({
    version: "12.1.3",
    dependencies: { "@betagouv/aides-velo": "1.11.0" },
    ...overrides,
  })
}

async function loadComputeSignature() {
  vi.resetModules()
  return (await import("@backend/lib/openfisca/compute-signature.js"))
    .getComputeSignature
}

// Le rafraîchissement est déclenché en arrière-plan : vider la file de
// microtâches suffit à le laisser aboutir, les dépendances étant simulées.
async function flushMicrotasks() {
  for (let index = 0; index < 5; index++) {
    await Promise.resolve()
  }
}

async function loadSettledSignature() {
  const getComputeSignature = await loadComputeSignature()
  getComputeSignature()
  await flushMicrotasks()
  return getComputeSignature
}

describe("getSituationSignature", () => {
  it("ignores the key order but not the values", async () => {
    const { getSituationSignature } = await import(
      "@backend/lib/openfisca/compute-signature.js"
    )

    const reference = getSituationSignature({
      dateDeValeur: new Date("2024-01-01"),
      menage: { loyer: 500, depcom: "75056" },
    })

    expect(
      getSituationSignature({
        menage: { depcom: "75056", loyer: 500 },
        dateDeValeur: new Date("2024-01-01"),
      }),
    ).toEqual(reference)
    expect(
      getSituationSignature({
        dateDeValeur: new Date("2024-01-01"),
        menage: { loyer: 600, depcom: "75056" },
      }),
    ).not.toEqual(reference)
  })
})

describe("getComputeSignature", () => {
  let consoleSpy

  beforeEach(() => {
    vi.clearAllMocks()
    catalog.value = { all: [{ id: "aide-a", montant: 100 }] }
    sources.requirements = A_REQUIREMENTS_FILE
    sources.packageJson = aPackageJson()
    sources.readError = undefined
    getCountryPackageMetadata.mockResolvedValue({
      name: "openfisca-france",
      version: "175.1.7",
    })
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("combines the country package version, the compute environment, the benefits digest and the simulation version", async () => {
    const getComputeSignature = await loadSettledSignature()

    expect(getComputeSignature()).toMatch(
      /^openfisca:openfisca-france@175\.1\.7\|environment:[0-9a-f]{12}\|benefits:[0-9a-f]{12}\|simulation:\d+$/,
    )
  })

  it("changes when the benefits catalog changes", async () => {
    const firstSignature = (await loadSettledSignature())()

    catalog.value = { all: [{ id: "aide-a", montant: 200 }] }

    expect((await loadSettledSignature())()).not.toEqual(firstSignature)
  })

  it("changes when OpenFisca is redeployed", async () => {
    const firstSignature = (await loadSettledSignature())()

    getCountryPackageMetadata.mockResolvedValue({
      name: "openfisca-france",
      version: "176.0.7",
    })

    expect((await loadSettledSignature())()).not.toEqual(firstSignature)
  })

  // `get_package_metadata()` ne décrit que le paquet pays : les extensions
  // (`OpenFisca-France-Local`, `Openfisca-Paris`) et la réforme EPCI ne sont
  // visibles que par `openfisca/requirements.txt`.
  it("changes when an OpenFisca extension is upgraded", async () => {
    const firstSignature = (await loadSettledSignature())()

    sources.requirements = A_REQUIREMENTS_FILE.replace("6.17.10", "6.18.0")

    expect((await loadSettledSignature())()).not.toEqual(firstSignature)
  })

  it("changes when the application version changes", async () => {
    const firstSignature = (await loadSettledSignature())()

    sources.packageJson = aPackageJson({ version: "12.2.0" })

    expect((await loadSettledSignature())()).not.toEqual(firstSignature)
  })

  it("changes when a compute dependency is upgraded", async () => {
    const firstSignature = (await loadSettledSignature())()

    sources.packageJson = aPackageJson({
      dependencies: { "@betagouv/aides-velo": "1.12.0" },
    })

    expect((await loadSettledSignature())()).not.toEqual(firstSignature)
  })

  it("queries OpenFisca once for repeated calls", async () => {
    const getComputeSignature = await loadSettledSignature()

    expect(getComputeSignature()).toEqual(getComputeSignature())
    expect(getCountryPackageMetadata).toHaveBeenCalledTimes(1)
  })

  it("queries OpenFisca again once the signature expires", async () => {
    vi.useFakeTimers()
    const getComputeSignature = await loadSettledSignature()

    vi.advanceTimersByTime(11 * 60 * 1000)
    getComputeSignature()
    await flushMicrotasks()

    expect(getCountryPackageMetadata).toHaveBeenCalledTimes(2)
  })

  // Attendre la racine OpenFisca, c'est ajouter son temps de réponse à chaque
  // lecture du cache et se river au service que la mise en cache soulage.
  it("never waits for OpenFisca", async () => {
    let resolveMetadata
    getCountryPackageMetadata.mockReturnValue(
      new Promise((resolve) => {
        resolveMetadata = resolve
      }),
    )
    const getComputeSignature = await loadComputeSignature()

    expect(getComputeSignature()).toBeNull()

    resolveMetadata({ name: "openfisca-france", version: "175.1.7" })
    await flushMicrotasks()

    expect(getComputeSignature()).not.toBeNull()
  })

  // Une racine OpenFisca en échec ne doit pas éteindre les caches : la version
  // d'un paquet ne change pas sans redémarrage du processus.
  it("keeps serving the last known signature when the refresh fails", async () => {
    vi.useFakeTimers()
    const getComputeSignature = await loadSettledSignature()
    const signature = getComputeSignature()

    getCountryPackageMetadata.mockRejectedValue(new Error("OF offline"))
    vi.advanceTimersByTime(11 * 60 * 1000)
    getComputeSignature()
    await flushMicrotasks()

    expect(getCountryPackageMetadata).toHaveBeenCalledTimes(2)
    expect(getComputeSignature()).toEqual(signature)
  })

  it("reports the failure and returns no signature when none was ever obtained", async () => {
    const error = new Error("OF offline")
    getCountryPackageMetadata.mockRejectedValue(error)
    const getComputeSignature = await loadSettledSignature()

    expect(getComputeSignature()).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unable to build the OpenFisca compute signature",
      error,
    )
    expect(captureException).toHaveBeenCalledWith(error)
  })

  // Une empreinte des sources illisible laisserait la signature aveugle aux
  // extensions OpenFisca et au code applicatif.
  it("reports the failure and returns no signature when the sources cannot be read", async () => {
    const error = new Error("ENOENT: openfisca/requirements.txt")
    sources.readError = error

    const getComputeSignature = await loadSettledSignature()

    expect(getComputeSignature()).toBeNull()
    expect(getCountryPackageMetadata).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unable to digest the compute environment sources",
      error,
    )
    expect(captureException).toHaveBeenCalledWith(error)
  })
})
