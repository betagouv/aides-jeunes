import path from "path"
import jamstackLoader from "jamstack-loader"

const __dirname = new URL(".", import.meta.url).pathname
const jamstack = jamstackLoader.get(
  path.join(__dirname, "../../contribuer/public/admin/config.yml")
)

describe("Test admin config", function () {
  it("should not have local_backend true", function () {
    expect(Boolean(jamstack.local_backend)).toBe(false)
  })
})
