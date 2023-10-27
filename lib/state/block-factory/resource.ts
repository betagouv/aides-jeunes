import Ressource from "@lib/ressource.js"
import { ChapterName } from "@lib/enums/chapter.js"
import { StepGenerator, ComplexStepGenerator } from "@lib/state/steps.js"

export function resourceBlocks(situation) {
  const individuResourceBlock = (individuId) => {
    const individu =
      situation[individuId] ||
      situation.enfants?.find((enfant) => enfant.id === individuId) ||
      {}
    return {
      steps: [
        new ComplexStepGenerator({
          route: `individu/${individuId}/ressources/types`,
          chapter: ChapterName.Revenus,
          entity: "individu",
          variable: "ressources",
          id: individuId,
        }),
      ].concat(
        Ressource.getIndividuRessourceCategories(individu, situation).map(
          (category) =>
            new ComplexStepGenerator({
              route: `individu/${individuId}/ressources/montants/${category}`,
              entity: "individu",
              variable: category,
              id: individuId,
            })
        )
      ),
    }
  }
  return {
    steps: [
      individuResourceBlock("demandeur"),
      ...(situation.conjoint ? [individuResourceBlock("conjoint")] : []),
      ...(situation.enfants?.length
        ? [
            new StepGenerator({
              entity: "individu",
              variable: "_hasRessources",
              id: "enfants",
            }),
          ]
        : []),
      {
        steps: situation.enfants
          ? situation.enfants.map((e) => {
              return e._hasRessources
                ? individuResourceBlock(e.id)
                : { steps: [] }
            })
          : [],
      },
    ],
  }
}
