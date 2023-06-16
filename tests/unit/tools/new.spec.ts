import { process } from "../../../../lib/benefits/link-validity.js"

function makeBenefitData(props) {
  return {
    id: "benefit_id",
    label: "Texte de l'aide",
    institution: "institution_label",
    priority: 0,
    links: [
      {
        link: "https://li.nk",
        type: "institution",
      },
    ],
    editLink: "https://edit.link",
    ...props,
  }
}

describe("process for new link results", () => {
  describe("process for new link results", () => {
    it("should anonymize followup", () => {
      const operations = process([], makeBenefitData())

      expect(operations).toHaveLength(1)
    })
  })
})
