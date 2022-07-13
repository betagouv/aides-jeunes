const path = require("path")

const { get } = require("jamstack-loader")
const jamstack = get(
  path.join(__dirname, "../../contribuer/public/admin/config.yml")
)

describe("Test admin config", function () {
  it("should not have local_backend true", function () {
    expect(Boolean(jamstack.local_backend)).toBe(false)
  })
})
