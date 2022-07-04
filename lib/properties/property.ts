import { EnumItemProperty, PropertyData } from "../types/property"
import { capitalize } from "../utils"

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
  }: {
    question: string | ((propertyData: PropertyData) => string)
    questionType?: string
    optional?: boolean
    help?: string
    moreInfo?: string | ((variation: any) => string)
    showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
  }) {
    this.question = question
    this.questionType = questionType
    this.optional = optional
    this.help = help
    this.moreInfo = moreInfo
    this.showMoreInfo = showMoreInfo
  }

  getValueOrExecuteFunction(key: string, propertyData: PropertyData): any {
    // @ts-ignore
    return typeof this[key] === "function" ? this[key](propertyData) : this[key]
  }

  getQuestion(propertyData: PropertyData) {
    return capitalize(this.getValueOrExecuteFunction("question", propertyData))
  }
}

export class EnumProperty extends Property {
  items:
    | EnumItemProperty[]
    | ((propertyData: PropertyData) => EnumItemProperty[])

  constructor({
    question,
    questionType,
    optional,
    help,
    moreInfo,
    showMoreInfo,
    items,
  }: {
    question: string | ((propertyData: PropertyData) => string)
    questionType?: string
    optional?: boolean
    help?: string
    moreInfo?: string | ((variation: any) => string)
    showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
    items:
      | EnumItemProperty[]
      | ((propertyData: PropertyData) => EnumItemProperty[])
  }) {
    super({
      question,
      questionType,
      optional,
      help,
      moreInfo,
      showMoreInfo,
    })
    this.items = items
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

export class NumberProperty extends Property {
  type: string
  unit?: string
  min?: number

  constructor({
    question,
    questionType,
    optional,
    help,
    moreInfo,
    showMoreInfo,
    type = "amount",
    unit,
    min,
  }: {
    question: string | ((propertyData: PropertyData) => string)
    questionType?: string
    optional?: boolean
    help?: string
    moreInfo?: string | ((variation: any) => string)
    showMoreInfo?: boolean | ((propertyData: PropertyData) => boolean)
    type?: string
    unit?: string
    min?: number
  }) {
    super({ question, questionType, help, optional, moreInfo, showMoreInfo })
    this.type = type
    this.unit = unit
    this.min = min
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
}
