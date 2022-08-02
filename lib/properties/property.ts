import { capitalize } from "../utils.js"
import {
  EnumItemProperty,
  ItemPropertyConstruct,
  NumberPropertyConstruct,
  PropertyConstruct,
  PropertyData,
} from "../types/property.js"

export class Property {
  question: string | ((propertyData: PropertyData) => string)
  questionType?: string
  optional?: boolean
  help?: string
  moreInfo?: string | ((variation: any) => string)
  showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)

  constructor({
    question,
    questionType,
    optional,
    help,
    moreInfo,
    showMoreInfo,
    getAnswerFormat,
  }: PropertyConstruct) {
    this.question = question
    this.questionType = questionType
    this.optional = optional
    this.help = help
    this.moreInfo = moreInfo
    this.showMoreInfo = showMoreInfo

    if (getAnswerFormat) {
      this.getAnswerFormat = getAnswerFormat
    }
  }

  getValueOrExecuteFunction(key: string, propertyData: PropertyData): any {
    // @ts-ignore
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
}

export class NumberProperty extends Property {
  type: string
  unit?: string
  min?: number

  constructor({
    question,
    optional,
    help,
    moreInfo,
    showMoreInfo,
    type = "amount",
    unit,
    min,
  }: NumberPropertyConstruct) {
    super({
      question,
      questionType: "number",
      help,
      optional,
      moreInfo,
      showMoreInfo,
    })
    this.type = type
    this.unit = unit
    this.min = min
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData): any {
    return {
      type: "number",
      min: this.min,
    }
  }
}

export class DepcomProperty extends Property {
  constructor({
    question,
    optional,
    help,
    moreInfo,
    showMoreInfo,
  }: {
    question: string | ((propertyData: PropertyData) => string)
    questionType?: string
    optional?: boolean
    help?: string
    moreInfo?: string | ((variation: any) => string)
    showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
  }) {
    super({
      question,
      questionType: "depcom",
      help,
      optional,
      moreInfo,
      showMoreInfo,
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
}

export class TextProperty extends Property {
  constructor({
    question,
    optional,
    help,
    moreInfo,
    showMoreInfo,
  }: {
    question: string | ((propertyData: PropertyData) => string)
    optional?: boolean
    help?: string
    moreInfo?: string | ((variation: any) => string)
    showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
  }) {
    super({
      question,
      questionType: "text",
      help,
      optional,
      moreInfo,
      showMoreInfo,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnswerFormat(propertyData: PropertyData): any {
    return {
      type: "string",
    }
  }
}
