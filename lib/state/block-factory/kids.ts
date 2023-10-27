import { childStepsComplete } from "@lib/enfants.js"
import { ChapterName } from "@lib/enums/chapter.js"
import { StepGenerator } from "@lib/state/steps.js"
import { individuBlockFactory } from "./individu.js"

export function kidBlock(situation) {
  return {
    steps: [
      ...(!childStepsComplete(situation)
        ? [new StepGenerator({ entity: "enfants", chapter: ChapterName.Foyer })]
        : []),
      ...(situation.enfants?.length
        ? situation.enfants.map((e) => {
            return {
              steps: [individuBlockFactory(e.id, ChapterName.Foyer)],
            }
          })
        : []),
      ...(childStepsComplete(situation)
        ? [new StepGenerator({ entity: "enfants", chapter: ChapterName.Foyer })]
        : []),
    ],
  }
}
