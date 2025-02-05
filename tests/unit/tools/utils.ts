export function makeBenefitData(props) {
  return {
    id: "benefit_id",
    label: "Texte de l'aide",
    institution: "institution_label",
    priority: 0,
    links: [
      {
        link: "https://li.nk",
        type: "form",
        status: 200,
        ok: true,
      },
      {
        link: "https://li.nk/ko",
        type: "link",
        status: 403,
        ok: false,
      },
    ],
    ...props,
  }
}
