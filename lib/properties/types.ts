export interface PropertyData {
  openFiscaParameters?: any
  simulation?: any
  individu?: any
  periods?: any
}

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
    const value = this[key]
    return typeof value === "function" ? value(propertyData) : value
  }

  getQuestion(propertyData: PropertyData) {
    return this.getValueOrExecuteFunction("question", propertyData)
  }
}

export class EnumProperty extends Property {
  items?: any[] | ((propertyData: PropertyData) => any[])

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
    items?: any[] | ((propertyData: PropertyData) => any[])
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

  getItems(propertyData: PropertyData) {
    return this.getValueOrExecuteFunction("items", propertyData)
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
