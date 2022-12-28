import {
  capitalize,
  displayYesNoValue,
  displayEnumValue,
  displayDepcomValue,
  displayDateValue,
} from "../utils.js"
import {
  EnumItemProperty,
  ItemPropertyConstruct,
  SliderPropertyConstruct,
  NumberPropertyConstruct,
  PropertyConstruct,
  PropertyData,
  RecapPropertyLine,
  Step,
} from "../types/property.js"
import { getStepAnswer } from "../answers.js"

export class Property {
  question: string | ((propertyData: PropertyData) => string)
  questionType?: string
  optional?: boolean
  help?: string
  moreInfo?: string | ((variation: any) => string)
  showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
  recapHeader?: (propertyData: PropertyData) => RecapPropertyLine

  constructor({
    question,
    questionType,
    optional,
    help,
    moreInfo,
    showMoreInfo,
    getAnswerFormat,
    recapHeader,
  }: PropertyConstruct) {
    this.question = question
    this.questionType = questionType
    this.optional = optional
    this.help = help
    this.moreInfo = moreInfo
    this.showMoreInfo = showMoreInfo
    this.showMoreInfo = showMoreInfo
    this.recapHeader = recapHeader

    if (getAnswerFormat) {
      this.getAnswerFormat = getAnswerFormat
    }
  }

  getValueOrExecuteFunction(key: string, propertyData: PropertyData): any {
    return typeof this[key] === "function" ? this[key](propertyData) : this[key]
  }

  getQuestion(propertyData: PropertyData) {
    return capitalize(this.getValueOrExecuteFunction("question", propertyData))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData) {}

  getFormat(propertyData: PropertyData): any {
    return {
      text: this.getQuestion(propertyData),
      type: this.questionType,
      help: this.help,
      answerFormat: this.getAnswerFormat(propertyData),
      optional: this.optional,
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return value
  }

  getRecap(propertyData: PropertyData, step: Step): RecapPropertyLine {
    const answer = getStepAnswer(propertyData.simulation.answers.all, step)

    return {
      label: this.getQuestion(propertyData),
      value:
        answer === undefined ? answer : this.displayValue(propertyData, answer),
    }
  }
}

export class BooleanProperty extends Property {
  // eslint-disable-next-line no-empty-pattern
  getAnswerFormat({}: PropertyData): any {
    return {
      type: "boolean",
      items: [
        {
          label: "Oui",
          value: true,
        },
        {
          label: "Non",
          value: false,
        },
      ],
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return displayYesNoValue(value)
  }
}

export class DateProperty extends Property {
  constructor(propertyConstruct: PropertyConstruct) {
    super({ ...propertyConstruct, questionType: "date" })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData): any {
    return {
      type: "date",
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return displayDateValue(value)
  }
}

export class ItemProperty extends Property {
  items:
    | EnumItemProperty[]
    | ((propertyData: PropertyData) => EnumItemProperty[])

  constructor(itemPropertyConstruct: ItemPropertyConstruct) {
    super(itemPropertyConstruct)
    this.items = itemPropertyConstruct.items
  }

  getRelevantItems(
    items: EnumItemProperty[],
    propertyData: PropertyData
  ): EnumItemProperty[] {
    return items.filter(
      (item: EnumItemProperty) =>
        !item.isRelevant || item.isRelevant(propertyData)
    )
  }

  getItems(propertyData: PropertyData): EnumItemProperty[] {
    return this.getRelevantItems(
      this.getValueOrExecuteFunction("items", propertyData),
      propertyData
    )
  }
}

export class EnumProperty extends ItemProperty {
  constructor(itemPropertyConstruct: ItemPropertyConstruct) {
    super({ ...itemPropertyConstruct, questionType: "enum" })
  }

  getAnswerFormat(propertyData: PropertyData): any {
    const items = this.getValueOrExecuteFunction("items", propertyData)
    return {
      type: typeof items[0]?.value,
      items,
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return displayEnumValue(value, this.getItems(propertyData))
  }
}

export class MultipleProperty extends ItemProperty {
  constructor(itemPropertyConstruct: ItemPropertyConstruct) {
    super({ ...itemPropertyConstruct, questionType: "multiple" })
  }

  getAnswerFormat(propertyData: PropertyData): any {
    const items = this.getValueOrExecuteFunction("items", propertyData)
    return {
      type: `${typeof items[0]?.value}[]`,
      items,
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return value
      .map((item: boolean | number | string) => {
        for (const answer of this.getItems(propertyData)) {
          if (item === answer.value) {
            return answer.label
          }
        }
      })
      .join(", ")
  }
}

export class SliderProperty extends ItemProperty {
  min?: number
  max?: number
  constructor(sliderPropertyConstruct: SliderPropertyConstruct) {
    super({ ...sliderPropertyConstruct, questionType: "slider" })
    this.min = sliderPropertyConstruct.min
    this.max = sliderPropertyConstruct.max
  }

  getAnswerFormat(propertyData: PropertyData): any {
    const items = this.getValueOrExecuteFunction("items", propertyData)
    return {
      type: `${typeof items[0]?.value}[]`,
      items,
      min: this.min,
      max: this.max,
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return value
  }
}

export class NumberProperty extends Property {
  type: string
  unit?: string
  min?: number
  max?: number

  constructor({
    type = "amount",
    ...numberPropertyConstruct
  }: NumberPropertyConstruct) {
    super({
      questionType: "number",
      ...numberPropertyConstruct,
    })
    this.type = type
    this.unit = numberPropertyConstruct.unit
    this.min = numberPropertyConstruct.min
    this.max = numberPropertyConstruct.max
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData): any {
    return {
      type: "number",
      min: this.min,
      max: this.max,
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return this.unit ? `${value} ${this.unit}` : value
  }
}

export class DepcomProperty extends Property {
  constructor(propertyConstruct: PropertyConstruct) {
    super({
      ...propertyConstruct,
      questionType: "depcom",
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData): any {
    return {
      type: {
        depcom: "string",
        _codePostal: "string",
        _nomCommune: "string",
        _departement: "string",
        _region: "string",
        _epci: "string",
        _epciType: "string",
      },
    }
  }

  displayValue(propertyData: PropertyData, value: any): string {
    return displayDepcomValue(value?._codePostal, value?._nomCommune)
  }
}

export class TextProperty extends Property {
  constructor(propertyConstruct: PropertyConstruct) {
    super({
      ...propertyConstruct,
      questionType: "text",
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData): any {
    return {
      type: "string",
    }
  }
}
