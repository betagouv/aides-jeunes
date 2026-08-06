import { expect, vi } from "vitest"

const { catalog, getCountryPackageMetadata, captureException } = vi.hoisted(
  () => ({
    catalog: { value: { all: [{ id: "aide-a", montant: 100 }] } as any },
    getCountryPackageMetadata: vi.fn(),
    captureException: vi.fn(),
  }),
)

vi.mock("@root/data/all.js", () => ({
  get default() {
    return catalog.value
  },
}))

vi.mock("@backend/lib/openfisca/getter.js", () => ({
  default: { getCountryPackageMetadata },
}))

vi.mock("@sentry/node", () => ({ captureException }))

async function loadComputeSignature() {
  vi.resetModules()
  return (await import("@backend/lib/openfisca/compute-signature.js"))
    .getComputeSignature
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

  it("combines the country package version, the benefits digest and the simulation version", async () => {
    const getComputeSignature = await loadComputeSignature()

    const signature = await getComputeSignature()

    expect(signature).toMatch(
      /^openfisca:openfisca-france@175\.1\.7\|benefits:[0-9a-f]{12}\|simulation:\d+$/,
    )
  })

  it("changes when the benefits catalog changes", async () => {
    const firstSignature = await (await loadComputeSignature())()

    catalog.value = { all: [{ id: "aide-a", montant: 200 }] }
    const secondSignature = await (await loadComputeSignature())()

    expect(secondSignature).not.toEqual(firstSignature)
  })

  it("changes when OpenFisca is redeployed", async () => {
    const firstSignature = await (await loadComputeSignature())()

    getCountryPackageMetadata.mockResolvedValue({
      name: "openfisca-france",
      version: "176.0.7",
    })
    const secondSignature = await (await loadComputeSignature())()

    expect(secondSignature).not.toEqual(firstSignature)
  })

  it("queries OpenFisca once for repeated calls", async () => {
    const getComputeSignature = await loadComputeSignature()

    const signatures = await Promise.all([
      getComputeSignature(),
      getComputeSignature(),
    ])
    await getComputeSignature()

    expect(getCountryPackageMetadata).toHaveBeenCalledTimes(1)
    expect(signatures[0]).toEqual(signatures[1])
  })

  it("queries OpenFisca again once the memoized signature expires", async () => {
    vi.useFakeTimers()
    const getComputeSignature = await loadComputeSignature()

    await getComputeSignature()
    vi.advanceTimersByTime(11 * 60 * 1000)
    await getComputeSignature()

    expect(getCountryPackageMetadata).toHaveBeenCalledTimes(2)
  })

  it("reports the failure and returns no signature when OpenFisca is unreachable", async () => {
    const error = new Error("OF offline")
    getCountryPackageMetadata.mockRejectedValue(error)
    const getComputeSignature = await loadComputeSignature()

    expect(await getComputeSignature()).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unable to build the OpenFisca compute signature",
      error,
    )
    expect(captureException).toHaveBeenCalledWith(error)
  })
})
