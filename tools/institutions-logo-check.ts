import data from "../data/all.js"
import express from "express"
import { __express } from "ejs"
import type { BenefitCatalog } from "../data/types/generator.d.js"
import type { Institution } from "../data/types/institutions.d.js"

const port = 9090
const app = express()
app.engine(".html", __express)
app.set("views", `${new URL(".", import.meta.url).pathname}/views`)
app.set("view engine", "html")
app.use(express.static("public"))

app.route("/").get(function (req, res) {
  const catalog = data as BenefitCatalog

  res.render("institutions", {
    institutions: Object.values(catalog.institutionsMap).map(
      (institution: Institution) => {
        return {
          image: institution.imgSrc,
          title: institution.label,
        }
      },
    ),
  })
})

app.listen(port, () => console.log(`The server is listening on port ${port}`))
